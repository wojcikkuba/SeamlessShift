from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from db import db
from models import SubjectTypeModel
from schemas import SubjectTypeSchema

blp = Blueprint("SubjectTypes", __name__,
                description="Operations on subject types")


@blp.route("/subject-type")
class SubjectTypeList(MethodView):
    @jwt_required()
    @blp.response(200, SubjectTypeSchema(many=True))
    def get(self):
        return SubjectTypeModel.query.all()

    @jwt_required()
    @blp.arguments(SubjectTypeSchema)
    @blp.response(201, SubjectTypeSchema)
    def post(self, subject_type_data):
        if SubjectTypeModel.query.filter(SubjectTypeModel.type == subject_type_data["type"]).first():
            abort(409, message="A subject type with that type already exists.")
        subject_type = SubjectTypeModel(**subject_type_data)
        try:
            db.session.add(subject_type)
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred while inserting the subject type.")
        return subject_type, 201


@blp.route("/subject-type/<int:subject_type_id>")
class SubjectType(MethodView):
    @jwt_required()
    @blp.response(200, SubjectTypeSchema)
    def get(self, subject_type_id):
        subject_type = SubjectTypeModel.query.get_or_404(subject_type_id)
        return subject_type

    @jwt_required()
    @blp.arguments(SubjectTypeSchema)
    @blp.response(200, SubjectTypeSchema)
    def put(self, subject_type_data, subject_type_id):
        subject_type = SubjectTypeModel.query.get_or_404(subject_type_id)
        subject_type.type = subject_type_data["type"]
        try:
            db.session.add(subject_type)
            db.session.commit()
        except IntegrityError:
            abort(400, message="A subject type with that type already exists.")
        return subject_type

    @jwt_required()
    def delete(self, subject_type_id):
        subject_type = SubjectTypeModel.query.get_or_404(subject_type_id)
        try:
            db.session.delete(subject_type)
            db.session.commit()
        except IntegrityError:
            abort(400, message="Cannot delete subject type with subjects assigned to it.")
        return {"message": "Subject type deleted"}
