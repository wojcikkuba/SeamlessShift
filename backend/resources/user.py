from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import create_access_token, jwt_required
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from passlib.hash import pbkdf2_sha256

from db import db
from models import UserModel
from schemas import PlainUserSchema, UserSchema, UserUpdateSchema

blp = Blueprint("Users", __name__, description="Operations on users")


@blp.route("/login")
class UserLogin(MethodView):
    @blp.arguments(PlainUserSchema)
    def post(self, user_data):
        user = UserModel.query.filter(
            UserModel.email == user_data["email"]
        ).first()

        user_schema = UserSchema()  # Change to blp.response

        if user and pbkdf2_sha256.verify(user_data["password"], user.password):
            access_token = create_access_token(identity=user.id)
            return {"token": access_token, "user": user_schema.dump(user)}

        abort(401, message="Niepoprawne dane logowania")


@blp.route("/user")
class UserList(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema(many=True))
    def get(self):
        return UserModel.query.all()

    @jwt_required()
    @blp.arguments(UserSchema)
    @blp.response(201, UserSchema)
    def post(self, user_data):
        if UserModel.query.filter(UserModel.email == user_data["email"]).first():
            abort(409, message="A user with that email address already exists.")
        elif UserModel.query.filter(UserModel.phone == user_data["phone"]).first():
            abort(409, message="A user with that phone number already exists.")
        user_data["password"] = pbkdf2_sha256.hash(user_data["password"])
        user = UserModel(**user_data)
        try:
            db.session.add(user)
            db.session.commit()
        except SQLAlchemyError:
            abort(500, message="An error occurred while inserting the user")
        return user, 201

# Bad data exception?


@blp.route("/user/<int:user_id>")
class User(MethodView):
    @jwt_required()
    @blp.response(200, UserSchema)
    def get(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        return user

    @jwt_required()
    @blp.arguments(UserUpdateSchema)
    @blp.response(200, UserSchema)
    def put(self, user_data, user_id):
        user = UserModel.query.get_or_404(user_id)
        if "password" in user_data:
            user_data["password"] = pbkdf2_sha256.hash(user_data["password"])
        # that loop should be replaced with something better
        for key, value in user_data.items():
            setattr(user, key, value)
        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            abort(
                400, message="The phone number or email address you provided already exists.")
        return user

    @jwt_required()
    def delete(self, user_id):
        user = UserModel.query.get_or_404(user_id)
        try:
            db.session.delete(user)
            db.session.commit()
        except IntegrityError:
            abort(400, message="Cannot delete user with subjects assigned to him.")
        return {"message": "User deleted"}
