from flask import Flask, jsonify
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from db import db
import models
import os

from resources.user import blp as UserBlueprint
from resources.facility import blp as FacilityBlueprint
from resources.role import blp as RoleBlueprint
from resources.course import blp as CourseBlueprint
from resources.subject_type import blp as SubjectTypeBlueprint
from resources.subject import blp as SubjectBlueprint


def create_app():
    app = Flask(__name__)

    CORS(app)

    # Update config for production use
    app.config["PROPAGATE_EXCEPTIONS"] = True
    app.config["API_TITLE"] = "Seamless Shift API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_POOL_TIMEOUT'] = 300
    # app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:password@172.17.0.2/shift_db?charset=utf8mb4"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True
    app.config["JWT_SECRET_KEY"] = "secret"

    db.init_app(app)
    api = Api(app)
    jwt = JWTManager(app)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return (
            jsonify(
                {
                    "message": "The token has expired.",
                    "error": "token_expired"
                }
            ), 401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {
                    "message": "Signature verification failed.",
                    "error": "invalid_token"
                }
            ),
            401,
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify(
                {
                    "description": "Request does not contain an access token.",
                    "error": "authorization_required"
                }
            ),
            401,
        )

    # move db creation to the __init__.py
    with app.app_context():
        db.create_all()

    api.register_blueprint(UserBlueprint)
    api.register_blueprint(FacilityBlueprint)
    api.register_blueprint(RoleBlueprint)
    api.register_blueprint(CourseBlueprint)
    api.register_blueprint(SubjectTypeBlueprint)
    api.register_blueprint(SubjectBlueprint)

    # if __name__ == '__main__':
    #    app.run()

    return app
