from db import db


class SubjectModel(db.Model):
    __tablename__ = "subject"

    id = db.Column('id', db.Integer, primary_key=True)
    description = db.Column('description', db.String(
        150), unique=False, nullable=True)
    day = db.Column('day', db.String(10), unique=False, nullable=False)
    start = db.Column('start', db.Time, unique=False, nullable=False)
    end = db.Column('end', db.Time, unique=False, nullable=False)
    classroom = db.Column('classroom', db.String(8),
                          unique=False, nullable=False)
    start_day = db.Column('start_day', db.Date, unique=False, nullable=False)
    end_day = db.Column('end_day', db.Date, unique=False, nullable=False)

    # Foreign keys
    user_id = db.Column('user_id', db.Integer, db.ForeignKey(
        "user.id"), unique=False, nullable=False)
    course_id = db.Column('course_id', db.Integer, db.ForeignKey(
        "course.id"), unique=False, nullable=False)
    subject_type_id = db.Column('subject_type_id', db.Integer, db.ForeignKey(
        "subject_type.id"), unique=False, nullable=False)

    # Relationships
    user = db.relationship("UserModel", back_populates="subjects")
    course = db.relationship("CourseModel", back_populates="subjects")
    subject_type = db.relationship(
        "SubjectTypeModel", back_populates="subjects")
