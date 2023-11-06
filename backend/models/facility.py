from db import db


class FacilityModel(db.Model):
    __tablename__ = "facility"

    id = db.Column('id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(60), unique=True, nullable=False)

    # Relationships
    users = db.relationship(
        "UserModel", back_populates="facility", lazy="dynamic")
