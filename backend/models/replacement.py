from db import db


class ReplacementModel(db.Model):
    __tablename__ = "replacement"

    id = db.Column('id', db.Integer, primary_key=True)

    # Foreign keys
    user_id = db.Column('user_id', db.Integer, db.ForeignKey(
        "user.id"), unique=False, nullable=False)
    subject_id = db.Column('subject_id', db.Integer, db.ForeignKey(
        "subject.id"), unique=False, nullable=False)
    request_id = db.Column('request_id', db.Integer, db.ForeignKey(
        "request.id"), unique=False, nullable=False)

    # Relationships
    user = db.relationship("UserModel", back_populates="replacements")
    subject = db.relationship("SubjectModel", back_populates="replacement")
    request = db.relationship("RequestModel", back_populates="replacement")
