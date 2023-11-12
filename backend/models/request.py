from db import db


class RequestModel(db.Model):
    __tablename__ = "request"

    id = db.Column('id', db.Integer, primary_key=True)
    issue_date = db.Column('issue_date', db.DateTime,
                           unique=False, nullable=False)
    comment = db.Column('comment', db.String(
        150), unique=False, nullable=True)
    date = db.Column('date', db.Date, unique=False, nullable=False)
    status = db.Column('status', db.String, unique=False, nullable=False)

    # Foreign keys
    user_id = db.Column('user_id', db.Integer, db.ForeignKey(
        "user.id"), unique=False, nullable=False)
    subject_id = db.Column('subject_id', db.Integer, db.ForeignKey(
        "subject.id"), unique=False, nullable=False)

    # Relationships
    user = db.relationship("UserModel", back_populates="requests")
    subject = db.relationship("SubjectModel", back_populates="requests")
