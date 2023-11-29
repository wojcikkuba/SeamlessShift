from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

import os
import requests

from db import db
from models import RequestModel, SubjectModel, ReplacementModel, UserModel
from schemas import ReplacementSchema

blp = Blueprint("Replacement", __name__,
                description="Operations on replacements")


def send_replacement_notification(first_name, last_name, email, user, subject, date):
    email_domain = os.getenv("EMAIL_DOMAIN")
    return requests.post(
        f"https://api.mailgun.net/v3/{email_domain}/messages",
        auth=("api", os.getenv("EMAIL_API_KEY")),
        data={"from": f"Mailgun Sandbox <postmaster@{email_domain}>",
                      "to": f"{first_name} {last_name} <{email}>",
                      "subject": f"Potwierdzenie zgłoszenia o zastępstwo",
              "text": f"Cześć {first_name}. Twoje zgłoszenie o zastępstwo zostało zatwierdzone. {user} poprowadzi twoje zajęcia {subject} {date}."})


@blp.route("/replacement")
class ReplacementResource(MethodView):
    @jwt_required()
    @blp.response(200, ReplacementSchema(many=True))
    def get(self):
        replacements = ReplacementModel.query.all()
        return replacements

    @jwt_required()
    @blp.arguments(ReplacementSchema)
    @blp.response(201, ReplacementSchema)
    def post(self, data):
        user_id = data['user_id']
        request_id = data['request_id']

        # Step 1: Check if the request status is 'Requested' and not 'Confirmed'
        request = RequestModel.query.get_or_404(request_id)
        if request.status != 'Requested':
            abort(400, message="Request is not in 'Requested' status.")

        # Step 2: Check if the user doesn't have any other subjects at that time and day.
        original_subject = request.subject

        overlapping_subject = SubjectModel.query.filter(
            SubjectModel.user_id == user_id,
            SubjectModel.date == original_subject.date,
            SubjectModel.start < original_subject.end,
            SubjectModel.end > original_subject.start
        ).first()
        if overlapping_subject:
            abort(
                409, message="Updating this subject would cause a time overlap with an existing subject.")

        # Step 3: Create a new subject for user_id from replacement
        new_subject = SubjectModel(
            description=original_subject.description,
            day=original_subject.day,
            start=original_subject.start,
            end=original_subject.end,
            classroom=original_subject.classroom,
            date=original_subject.date,
            visible=True,
            user_id=user_id,
            course_id=original_subject.course_id,
            subject_type_id=original_subject.subject_type_id
        )
        try:
            db.session.add(new_subject)
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred while inserting the subject.")

        # Step 4: Create a new record in the replacement db table
        replacement = ReplacementModel(
            user_id=user_id, subject_id=new_subject.id, request_id=request_id)
        try:
            db.session.add(replacement)
        except IntegrityError:
            abort(500, message="An error occurred while inserting the replacement.")

        # Step 5: Change request status to 'Confirmed'
        request.status = 'Confirmed'

        # Step 6: Change the subject from request visible to false
        original_subject.visible = False

        try:
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred during the replacement process.")

        # Step 7: Send notification to the requester
        replacer = UserModel.query.get_or_404(user_id)
        requester = request.user

        send_replacement_notification(requester.firstName, requester.lastName, requester.email,
                                      f"{replacer.firstName} {replacer.lastName}", original_subject.course.name, original_subject.date)

        return replacement, 201


@blp.route("/replacement/<int:replacement_id>")
class Replacement(MethodView):
    @jwt_required()
    @blp.response(200, ReplacementSchema)
    def get(self, replacement_id):
        replacement = ReplacementModel.query.get_or_404(replacement_id)
        return replacement

    @jwt_required()
    def delete(self, replacement_id):
        replacement = ReplacementModel.query.get_or_404(replacement_id)
        request = replacement.request
        original_subject = request.subject
        replacement_subject = replacement.subject

        # Step 1: Change the subject from request visible to true
        original_subject.visible = True

        # Step 2: Remove a new record in the replacement db table
        try:
            db.session.commit()
            db.session.delete(replacement)
        except IntegrityError:
            abort(500, message="An error occurred while inserting the subject.")

        # Step 3: Remove a new subject for user_id from replacement
        db.session.delete(replacement_subject)
        try:
            db.session.delete(replacement_subject)
        except IntegrityError:
            abort(400, message="Cannot delete subject with request assigned to it.")

        # Step 4: Change request status to 'Requested'
        request.status = 'Requested'

        try:
            db.session.commit()
        except IntegrityError:
            abort(
                500, message="An error occurred during the replacement removing process.")

        return {"message": "Replacement deleted"}
