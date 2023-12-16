import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import { Link, useParams, useNavigate } from "react-router-dom";

function EditSubject() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subjectData, setSubjectData] = useState({
    description: "",
    start: "",
    end: "",
    classroom: "",
    date: "",
    day: "",
    user_id: "",
    course_id: "",
    subject_type_id: 1,
    visible: true,
    start_date: "",
    end_date: "",
  });

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjectTypes, setSubjectTypes] = useState([]);

  const token = localStorage.getItem("token");
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjectDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/subject/${subjectId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const subjectData = await response.json();
        setSubjectData(subjectData);
      } catch (error) {
        console.error("Error fetching subject details from API:", error);
        setError("Error fetching subject details from API");
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/user?deleted=false",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Data from API is not an array.");
        }

        setUsers(data);
      } catch (error) {
        console.error("Error fetching users from API:", error);
        setError("Error fetching users from API");
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/course", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Data from API is not an array.");
        }

        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses from API:", error);
        setError("Error fetching courses from API");
      }
    };

    const fetchSubjectTypes = async () => {
      try {
        const response = await fetch("http://localhost:5000/subject-type", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Data from API is not an array.");
        }

        setSubjectTypes(data);
      } catch (error) {
        console.error("Error fetching subject types from API:", error);
        setError("Error fetching subject types from API");
      }
    };

    fetchSubjectDetails();
    fetchUsers();
    fetchCourses();
    fetchSubjectTypes();
  }, [subjectId, token]);

  const validateFields = () => {
    const {
      description,
      start,
      end,
      classroom,
      date,
      day,
      user_id,
      course_id,
      subject_type_id,
    } = subjectData;

    const isFormValid =
      description !== "" &&
      start !== "" &&
      end !== "" &&
      classroom !== "" &&
      date !== "" &&
      day !== "" &&
      user_id !== "" &&
      course_id !== "" &&
      subject_type_id !== "";

    setIsSaveButtonDisabled(!isFormValid);
  };

  useEffect(() => {
    validateFields();
  }, [subjectData]);

  const handleSaveChanges = async () => {
    try {
      const payload = {
        description: subjectData.description,
        day: subjectData.day,
        start: subjectData.start,
        end: subjectData.end,
        classroom: subjectData.classroom,
        date: subjectData.date,
        user_id: parseInt(subjectData.user_id),
        course_id: parseInt(subjectData.course_id),
        subject_type_id: parseInt(subjectData.subject_type_id),
        visible: subjectData.visible,
      };

      const response = await fetch(
        `http://localhost:5000/subject/${subjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Subject updated successfully!");
      navigate("/admin/manage-subjects", {
        state: {
          selectedDate: subjectData.date,
          selectedUser: subjectData.user_id,
          subjectId,
        },
      });
    } catch (error) {
      console.error("Error updating subject:", error);
      setError("Error updating subject");
    }
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Edycja przedmiotu</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Opis</label>
                        <Input
                          type="text"
                          value={subjectData.description}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              description: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Godzina rozpoczęcia</label>
                        <Input
                          type="time"
                          value={subjectData.start}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              start: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Godzina zakończenia</label>
                        <Input
                          type="time"
                          value={subjectData.end}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              end: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Sala</label>
                        <Input
                          type="text"
                          value={subjectData.classroom}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              classroom: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Data rozpoczęcia okresu</label>
                        <Input
                          type="date"
                          value={subjectData.start_date}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              start_date: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Data zakończenia okresu</label>
                        <Input
                          type="date"
                          value={subjectData.end_date}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              end_date: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Prowadzący</label>
                        <Input
                          type="select"
                          value={subjectData.user_id}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              user_id: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Wybierz prowadzącego
                          </option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.lastName} ({user.email})
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Nazwa przedmiotu</label>
                        <Input
                          type="select"
                          value={subjectData.course_id}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              course_id: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Wybierz nazwę przedmiotu
                          </option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Typ</label>
                        <Input
                          type="select"
                          value={subjectData.subject_type_id}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              subject_type_id: e.target.value,
                            })
                          }
                        >
                          <option value="" disabled>
                            Wybierz typ przedmiotu
                          </option>
                          {subjectTypes.map((subjectType) => (
                            <option key={subjectType.id} value={subjectType.id}>
                              {subjectType.type}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Dzień tygodnia</label>
                        <Input
                          type="select"
                          value={subjectData.day}
                          onChange={(e) =>
                            setSubjectData({
                              ...subjectData,
                              day: e.target.value,
                            })
                          }
                        >
                          <option value="Monday">Poniedziałek</option>
                          <option value="Tuesday">Wtorek</option>
                          <option value="Wednesday">Środa</option>
                          <option value="Thursday">Czwartek</option>
                          <option value="Friday">Piątek</option>
                          <option value="Saturday">Sobota</option>
                          <option value="Sunday">Niedziela</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <Row>
                  <Link to="/admin/manage-subjects">
                    <Button color="primary" className="ml-3">
                      Powrót
                    </Button>
                  </Link>
                  <Button
                    color="success"
                    className="ml-2"
                    onClick={handleSaveChanges}
                    disabled={isSaveButtonDisabled}
                  >
                    Zapisz zmiany
                  </Button>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default EditSubject;
