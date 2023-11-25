from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timedelta

from db import db
from models import SubjectModel, UserModel
from schemas import SubjectSchema, SubjectUpdateSchema

blp = Blueprint("Subjects", __name__, description="Operations on subjects")


def get_dates_for_day(start_date, end_date, day):
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    date_list = []
    while start <= end:
        if start.strftime("%A").lower() == day.lower():
            date_list.append(start.date())
        start += timedelta(days=1)
    return date_list


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

        # Validate that 'day' and 'date' correspond to the same day of the week
        day_of_week = subject_data["date"].strftime("%A").lower()
        if day_of_week != subject_data["day"].lower():
            abort(400, message="The day of the week does not match the date provided.")

        # Check if the user doesn't have any other subjects at that time and day.
        overlapping_subject = SubjectModel.query.filter(
            SubjectModel.user_id == subject_data["user_id"],
            SubjectModel.date == subject_data["date"],
            SubjectModel.start < subject_data["end"],
            SubjectModel.end > subject_data["start"]
        ).first()
        if overlapping_subject:
            abort(
                409, message="Updating this subject would cause a time overlap with an existing subject.")

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
        # if "start" in subject_data and "end" in subject_data and subject_data["start"] >= subject_data["end"]:
        #     abort(400, message="Start time should be less than end time.")

        # Check if the user doesn't have any other subjects at that time and day.
        # overlapping_subject = SubjectModel.query.filter(
        #     SubjectModel.date == subject_data["date"],
        #     SubjectModel.start < subject_data["end"],
        #     SubjectModel.end > subject_data["start"]
        # ).first()
        # if overlapping_subject:
        #     abort(
        #         409, message="Updating this subject would cause a time overlap with an existing subject.")

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
        try:
            db.session.delete(subject)
            db.session.commit()
        except IntegrityError:
            abort(400, message="Cannot delete subject with requests assigned to it.")
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

        # Fetch subjects for the user that fall on the queried_date and match the day
        subjects = SubjectModel.query.filter(
            SubjectModel.user_id == user_id,
            SubjectModel.date == queried_date
        ).all()

        return subjects


@blp.route("/subject/start/<start_date>/end/<end_date>")
class SubjectByDateRange(MethodView):
    @jwt_required()
    @blp.arguments(SubjectSchema)
    @blp.response(201, SubjectSchema(many=True))
    def post(self, subject_data, start_date, end_date):
        # Check that end_date is greater than start_date
        if datetime.strptime(start_date, "%Y-%m-%d") >= datetime.strptime(end_date, "%Y-%m-%d"):
            abort(400, message="End date must be greater than start date.")

        # Generate dates for the specified day
        dates = get_dates_for_day(start_date, end_date, subject_data['day'])

        created_subjects = []
        for date in dates:
            # Check if there is an existing subject at the same time
            overlapping_subject = SubjectModel.query.filter(
                SubjectModel.user_id == subject_data["user_id"],
                SubjectModel.date == date,
                SubjectModel.start < subject_data["end"],
                SubjectModel.end > subject_data["start"]
            ).first()

            if overlapping_subject:
                continue  # Skip creating a subject for this date due to overlap

            # Create new subject
            new_subject_data = subject_data.copy()
            new_subject_data['date'] = date
            new_subject_data['user_id'] = subject_data["user_id"]
            new_subject = SubjectModel(**new_subject_data)

            try:
                db.session.add(new_subject)
                db.session.commit()
                created_subjects.append(new_subject)
            except IntegrityError:
                abort(500, message=f"An error occurred while inserting the subject for date {date}.")

        return created_subjects