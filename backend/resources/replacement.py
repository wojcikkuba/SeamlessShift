from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from db import db
from models import RequestModel, SubjectModel, ReplacementModel

blp = Blueprint("Replacement", __name__, description="Operations on replacements")

@blp.route("/replacement")
class ReplacementResource(MethodView):
    @jwt_required()
    @blp.response(200, ReplacementSchema(many=True))
    def get(self):
        replacements = ReplacementModel.query.all()
        return replacements

    @jwt_required()
    @blp.arguments(RequestSchema)
    @blp.response(201, ReplacementModel)
    def post(self, data):
        user_id = data['user_id']
        request_id = data['request_id']

        # Step 1: Check if the request status is 'Requested' and not 'Confirmed'
        request = RequestModel.query.get_or_404(request_id)
        if request.status != 'Requested':
            abort(400, message="Request is not in 'Requested' status.")

        # Step 2: Create a new subject for user_id from replacement
        original_subject = request.subject
        
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
        db.session.add(new_subject)
        db.session.commit()

        # Step 3: Create a new record in the replacement db table
        replacement = ReplacementModel(user_id=user_id, subject_id=new_subject.id, request_id=request_id)
        db.session.add(replacement)

        # Step 4: Change request status to 'Confirmed'
        request.status = 'Confirmed'

        # Step 5: Change the subject from request visible to false
        original_subject.visible = False

        try:
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred during the replacement process.")

        return replacement
