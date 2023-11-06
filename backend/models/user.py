from db import db


class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column('id', db.Integer, primary_key=True)
    password = db.Column('password', db.String(128),
                         unique=False, nullable=False)
    firstName = db.Column('name', db.String(45), unique=False, nullable=False)
    lastName = db.Column('surname', db.String(
        45), unique=False, nullable=False)
    email = db.Column('email', db.String(90), unique=True, nullable=False)
    phone = db.Column('phone', db.String(15), unique=True, nullable=False)
    deleted = db.Column('deleted', db.Boolean, unique=False, nullable=False)
    password_change_required = db.Column(
        'password_change_required', db.Boolean, unique=False, nullable=False)

    # Foreign keys
    facility_id = db.Column('facility_id', db.Integer, db.ForeignKey(
        "facility.id"), unique=False, nullable=False)
    role_id = db.Column('role_id', db.Integer, db.ForeignKey(
        "role.id"), unique=False, nullable=False)

    # Relationships
    facility = db.relationship("FacilityModel", back_populates="users")
    role = db.relationship("RoleModel", back_populates="users")
    subjects = db.relationship(
        "SubjectModel", back_populates="user", lazy='dynamic')
