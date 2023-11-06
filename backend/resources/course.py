from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError

from db import db
from models import CourseModel
from schemas import CourseSchema

blp = Blueprint("Courses", __name__, description="Operations on courses")


@blp.route("/course")
class CourseList(MethodView):
    @jwt_required()
    @blp.response(200, CourseSchema(many=True))
    def get(self):
        return CourseModel.query.all()

    @jwt_required()
    @blp.arguments(CourseSchema)
    @blp.response(201, CourseSchema)
    def post(self, course_data):
        if CourseModel.query.filter(CourseModel.name == course_data["name"]).first():
            abort(409, message="A course with that name already exists.")
        course = CourseModel(**course_data)
        try:
            db.session.add(course)
            db.session.commit()
        except IntegrityError:
            abort(500, message="An error occurred while inserting the course")
        return course, 201


@blp.route("/course/<int:course_id>")
class Course(MethodView):
    @jwt_required()
    @blp.response(200, CourseSchema)
    def get(self, course_id):
        course = CourseModel.query.get_or_404(course_id)
        return course

    @jwt_required()
    @blp.arguments(CourseSchema)
    @blp.response(200, CourseSchema)
    def put(self, course_data, course_id):
        course = CourseModel.query.get_or_404(course_id)
        course.name = course_data["name"]
        try:
            db.session.add(course)
            db.session.commit()
        except IntegrityError:
            abort(400, message="A course with that name already exists.")
        return course

    @jwt_required()
    def delete(self, course_id):
        course = CourseModel.query.get_or_404(course_id)
        try:
            db.session.delete(course)
            db.session.commit()
        except IntegrityError:
            abort(400, message="Cannot delete course with subjects assigned to it.")
        return {"message": "Course deleted"}
