from db import db


class SubjectTypeModel(db.Model):
    __tablename__ = "subject_type"

    id = db.Column('id', db.Integer, primary_key=True)
    type = db.Column('type', db.String(45), unique=True, nullable=False)

    # Relationships
    subjects = db.relationship(
        "SubjectModel", back_populates="subject_type", lazy='dynamic')
