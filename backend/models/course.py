from db import db


class CourseModel(db.Model):
    __tablename__ = "course"

    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(60), unique=True, nullable=False)

    # Relationships
    subjects = db.relationship(
        "SubjectModel", back_populates="course", lazy='dynamic')

