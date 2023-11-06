from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from db import db
from models import FacilityModel
from schemas import PlainFacilitySchema, FacilitySchema

blp = Blueprint("Facilities", __name__, description="Operations on facilities")


@blp.route("/facility")
class FacilityList(MethodView):

    @jwt_required()
    # Should it return information about users?
    @blp.response(200, FacilitySchema(many=True))
    def get(self):
        return FacilityModel.query.all()

    @jwt_required()
    @blp.arguments(FacilitySchema)
    @blp.response(201, FacilitySchema)
    def post(self, facility_data):
        if FacilityModel.query.filter(FacilityModel.name == facility_data["name"]).first():
            abort(409, message="A facility with that name already exists.")
        facility = FacilityModel(**facility_data)
        try:
            db.session.add(facility)
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred while inserting the facility")
        return facility, 201


@blp.route("/facility/<int:facility_id>")
class Facility(MethodView):

    @jwt_required()
    @blp.response(200, FacilitySchema)
    def get(self, facility_id):
        facility = FacilityModel.query.get_or_404(facility_id)
        return facility

    @jwt_required()
    @blp.arguments(FacilitySchema)
    @blp.response(200, FacilitySchema)
    def put(self, facility_data, facility_id):
        facility = FacilityModel.query.get_or_404(facility_id)
        facility.name = facility_data["name"]
        try:
            db.session.add(facility)
            db.session.commit()
        except IntegrityError:
            abort(400, message="A facility with that name already exists.")
        return facility

    @jwt_required()
    def delete(self, facility_id):
        # Add error message when facility is assigned to user
        facility = FacilityModel.query.get_or_404(facility_id)
        try:
            db.session.delete(facility)
            db.session.commit()
        except IntegrityError:
            abort(400, message="Cannot delete facility with users assigned to it.")
        return {"message": "Facility deleted"}
