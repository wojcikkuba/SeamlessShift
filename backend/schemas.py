from marshmallow import Schema, fields


class PlainRoleSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


class PlainFacilitySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


class PlainCourseSchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)


class PlainSubjectTypeSchema(Schema):
    id = fields.Int(dump_only=True)
    type = fields.Str()


class PlainUserSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)


class PlainSubjectSchema(Schema):
    id = fields.Int(dump_only=True)
    description = fields.Str()
    day = fields.Str(required=True)
    start = fields.Time(required=True)
    end = fields.Time(required=True)
    classroom = fields.Str(required=True)
    start_day = fields.Date(required=True)
    end_day = fields.Date(required=True)
    user_id = fields.Int(required=True)
    course_id = fields.Int(required=True)
    subject_type_id = fields.Int(required=True)


class UserSchema(PlainUserSchema):
    firstName = fields.Str(required=True)
    lastName = fields.Str(required=True)
    phone = fields.Str(required=True)
    deleted = fields.Bool(required=True)
    password_change_required = fields.Bool(required=True)

    facility_id = fields.Int(required=True)
    facility = fields.Nested(PlainFacilitySchema(), dump_only=True)

    role_id = fields.Int(required=True)
    role = fields.Nested(PlainRoleSchema(), dump_only=True)

    # subjects = fields.List(fields.Nested(PlainSubjectSchema()), dump_only=True)


class SubjectSchema(PlainSubjectSchema):
    user = fields.Nested(PlainUserSchema(), dump_only=True)
    course = fields.Nested(PlainCourseSchema(), dump_only=True)
    subject_type = fields.Nested(PlainSubjectTypeSchema(), dump_only=True)


class UserUpdateSchema(Schema):
    password = fields.Str()
    firstName = fields.Str()
    lastName = fields.Str()
    email = fields.Str()
    phone = fields.Str()
    facility_id = fields.Int()  # Consider to remove this
    role_id = fields.Int()  # Consider to remove this
    deleted = fields.Bool()
    password_change_required = fields.Bool()


class SubjectUpdateSchema(Schema):
    description = fields.Str()
    day = fields.Str()
    start = fields.Time()
    end = fields.Time()
    classroom = fields.Str()
    start_day = fields.Date()
    end_day = fields.Date()
    user_id = fields.Int()
    course_id = fields.Int()
    subject_type_id = fields.Int()


class RoleSchema(PlainRoleSchema):
    users = fields.List(fields.Nested(UserSchema()), dump_only=True)


class FacilitySchema(PlainFacilitySchema):
    users = fields.List(fields.Nested(UserSchema()), dump_only=True)


class CourseSchema(PlainCourseSchema):
    subjects = fields.List(fields.Nested(PlainSubjectSchema()), dump_only=True) # do we need it ?


class SubjectTypeSchema(PlainSubjectTypeSchema):
    subjects = fields.List(fields.Nested(PlainSubjectSchema()), dump_only=True) # do we need it ?
