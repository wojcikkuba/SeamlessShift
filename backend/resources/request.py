from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from datetime import datetime

from db import db
from models import RequestModel, UserModel
from schemas import RequestSchema, RequestUpdateSchema

blp = Blueprint("Requests", __name__, description="Operations on requests")

@blp.route("/request")
class RequestList(MethodView):
    @jwt_required()
    @blp.response(200, RequestSchema(many=True))
    def get(self):
        return RequestModel.query.all()

    @jwt_required()
    @blp.arguments(RequestSchema)
    @blp.response(201, RequestSchema)
    def post(self, request_data):
        request = RequestModel(**request_data)
        db.session.add(request)
        db.session.commit()
        return request, 201

@blp.route("/request/<int:request_id>")
class RequestResource(MethodView):
    @jwt_required()
    @blp.response(200, RequestSchema)
    def get(self, request_id):
        request = RequestModel.query.get_or_404(request_id)
        return request

    @jwt_required()
    @blp.arguments(RequestUpdateSchema)
    @blp.response(200, RequestSchema)
    def put(self, update_data, request_id):
        request = RequestModel.query.get_or_404(request_id)
        for key, value in update_data.items():
            setattr(request, key, value)
        db.session.commit()
        return request

    @jwt_required()
    def delete(self, request_id):
        request = RequestModel.query.get_or_404(request_id)
        db.session.delete(request)
        db.session.commit()
        return {"message": "Request deleted"}

@blp.route("/request/<int:user_id>")
class RequestByUser(MethodView):
    @jwt_required()
    @blp.response(200, RequestSchema(many=True))
    def get(self, user_id):
        return RequestModel.query.filter_by(user_id=user_id).all()

@blp.route("/request/<int:user_id>/<string:date>")
class RequestByUserAndDate(MethodView):
    @jwt_required()
    @blp.response(200, RequestSchema(many=True))
    def get(self, user_id, date):
        try:
            date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            abort(400, message="Invalid date format. Use YYYY-MM-DD.")
        return RequestModel.query.filter_by(user_id=user_id, date=date).all()

