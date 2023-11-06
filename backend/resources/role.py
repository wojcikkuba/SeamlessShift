from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from db import db
from models import RoleModel
from schemas import RoleSchema, PlainRoleSchema

blp = Blueprint("Roles", __name__, description="Operations on roles")


@blp.route("/role")
class RoleList(MethodView):

    @jwt_required()
    @blp.response(200, RoleSchema(many=True))
    def get(self):
        return RoleModel.query.all()

    @jwt_required()
    @blp.arguments(RoleSchema)
    @blp.response(201, RoleSchema)
    def post(self, role_data):
        if RoleModel.query.filter(RoleModel.name == role_data["name"]).first():
            abort(409, message="A role with that name already exists.")
        role = RoleModel(**role_data)
        try:
            db.session.add(role)
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred while inserting the role")
        return role, 201


@blp.route("/role/<int:role_id>")
class Role(MethodView):

    @jwt_required()
    @blp.response(200, RoleSchema)
    def get(self, role_id):
        role = RoleModel.query.get_or_404(role_id)
        return role

    @jwt_required()
    @blp.arguments(PlainRoleSchema)
    @blp.response(200, RoleSchema)
    def put(self, role_data, role_id):
        role = RoleModel.query.get_or_404(role_id)
        role.name = role_data["name"]
        try:
            db.session.add(role)
            db.session.commit()
        except IntegrityError:
            abort(400, message="A role with that name already exists.")
        return role

    @jwt_required()
    def delete(self, role_id):
        role = RoleModel.query.get_or_404(role_id)
        try:
            db.session.delete(role)
            db.session.commit()
        except IntegrityError:
            abort(400, message="Cannot delete role with users assigned to it.")
        return {"message": "Role deleted"}
