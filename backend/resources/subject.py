from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from db import db
from models import SubjectModel, UserModel
from schemas import SubjectSchema, SubjectUpdateSchema

blp = Blueprint("Subjects", __name__, description="Operations on subjects")


@blp.route("/subject")
class SubjectList(MethodView):
    @jwt_required()
    @blp.response(200, SubjectSchema(many=True))
    def get(self):
        return SubjectModel.query.all()

    @jwt_required()
    @blp.arguments(SubjectSchema)
    @blp.response(201, SubjectSchema)
    def post(self, subject_data):
        # Check conditions before adding
        if subject_data["start"] >= subject_data["end"]:
            abort(400, message="Start time should be less than end time.")
        if subject_data["start_day"] > subject_data["end_day"]:
            abort(400, message="Start day should be less than or equal to end day.")

        # Check if the user doesn't have any other subjects at that time and day.
        existing_subjects = UserModel.query.get(subject_data["user_id"]).subjects.filter(
            SubjectModel.day == subject_data["day"],
            SubjectModel.start < subject_data["end"],
            SubjectModel.end > subject_data["start"]
        ).all()

        if existing_subjects:
            abort(400, message="User already has a subject scheduled at this time.")

        # Add the subject
        subject = SubjectModel(**subject_data)
        try:
            db.session.add(subject)
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred while inserting the subject.")
        return subject, 201


@blp.route("/subject/<int:subject_id>")
class Subject(MethodView):
    @jwt_required()
    @blp.response(200, SubjectSchema)
    def get(self, subject_id):
        subject = SubjectModel.query.get_or_404(subject_id)
        return subject

    @jwt_required()
    @blp.arguments(SubjectUpdateSchema)
    @blp.response(200, SubjectSchema)
    def put(self, subject_data, subject_id):
        subject = SubjectModel.query.get_or_404(subject_id)

        # Check conditions before updating
        if "start" in subject_data and "end" in subject_data and subject_data["start"] >= subject_data["end"]:
            abort(400, message="Start time should be less than end time.")
        if "start_day" in subject_data and "end_day" in subject_data and subject_data["start_day"] > subject_data["end_day"]:
            abort(400, message="Start day should be less than or equal to end day.")

        # Check if the user doesn't have any other subjects at that time and day.
        existing_subjects = UserModel.query.get(subject_data.get("user_id", subject.user_id)).subjects.filter(
            SubjectModel.id != subject_id,
            SubjectModel.day == subject_data.get("day", subject.day),
            SubjectModel.start < subject_data.get("end", subject.end),
            SubjectModel.end > subject_data.get("start", subject.start)
        ).all()

        if existing_subjects:
            abort(400, message="User already has a subject scheduled at this time.")

        # Update the subject
        for key, value in subject_data.items():
            setattr(subject, key, value)
        try:
            db.session.add(subject)
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred while updating the subject.")
        return subject

    @jwt_required()
    def delete(self, subject_id):
        subject = SubjectModel.query.get_or_404(subject_id)
        db.session.delete(subject)
        db.session.commit()
        return {"message": "Subject deleted"}


@blp.route("/subject/<int:user_id>/<string:date>")
class SubjectsByDate(MethodView):
    @jwt_required()
    @blp.response(200, SubjectSchema(many=True))
    def get(self, user_id, date):
        try:
            # Convert string to date object
            queried_date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            abort(400, message="Invalid date format. Use YYYY-MM-DD.")

        # Get the day string (e.g., "Monday", "Tuesday", etc.)
        day_str = queried_date.strftime("%A")

        # Fetch subjects for the user that fall on the queried_date and match the day
        subjects = SubjectModel.query.filter(
            SubjectModel.user_id == user_id,
            SubjectModel.start_day <= queried_date,
            SubjectModel.end_day >= queried_date,
            SubjectModel.day == day_str
        ).all()

        return subjects
