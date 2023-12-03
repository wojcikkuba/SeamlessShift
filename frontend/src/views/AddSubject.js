import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Spinner,
} from "reactstrap";

function AddSubject() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    start: "",
    end: "",
    classroom: "",
    date: "",
    day: "Monday",
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
  const [newCourseName, setNewCourseName] = useState("");
  const [isSuccessMessageVisible, setIsSuccessMessageVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/user?deleted=false", {
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
        throw new Error("Dane z API nie są tablicą.");
      }

      setUsers(data);
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
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
        throw new Error("Dane z API nie są tablicą.");
      }

      setCourses(data);
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    }
  };

  const fetchSubjectTypes = async () => {
    try {
      const token = localStorage.getItem("token");
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
        throw new Error("Dane z API nie są tablicą.");
      }

      setSubjectTypes(data);
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchSubjectTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleNewCourseInputChange = (e) => {
    setNewCourseName(e.target.value);
  }

  const handleAddNewCourse = async () => {
    try {
      const token = localStorage.getItem("token");

      if (newCourseName.trim() === "") {
        return;
      }

      const response = await fetch("http://localhost:5000/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCourseName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsSuccessMessageVisible(true);
      setNewCourseName("");
      fetchCourses();
    } catch (error) {
      console.error("Błąd dodawania nowego przedmiotu:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Ustawienie pola 'day' na podstawie daty rozpoczęcia okresu
      const startDayOfWeek = new Date(formData.start_date).toLocaleString("pl-pl", { weekday: "long" });
      setFormData((prevFormData) => ({
        ...prevFormData,
        day: startDayOfWeek,
      }));

      // Usunięcie niepotrzebnych pól
      const { date, ...requestData } = formData;

      const { start_date, end_date, ...finalData } = requestData;

      const apiUrl = `http://localhost:5000/subject/start/${start_date}/end/${end_date}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Nowe zajęcia zostały dodane pomyślnie.");
    } catch (error) {
      console.error("Błąd dodawania zajęć:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccessMessageVisible) {
      const timeoutId = setTimeout(() => {
        setIsSuccessMessageVisible(false);
      }, 5000)

      return () => clearTimeout(timeoutId);
    }
  }, [isSuccessMessageVisible]);

  return (
    <>
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Dodaj nowe zajęcia</CardTitle>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="course_id">Nazwa przedmiotu</Label>
                        <Input
                          type="select"
                          id="course_id"
                          name="course_id"
                          value={formData.course_id}
                          onChange={handleInputChange}
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
                    <Col md={6}>
                      <FormGroup>
                        <Label for="user_id">Prowadzący</Label>
                        <Input
                          type="select"
                          id="user_id"
                          name="user_id"
                          value={formData.user_id}
                          onChange={handleInputChange}
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
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="start">Godzina rozpoczęcia</Label>
                        <Input
                          type="time"
                          id="start"
                          name="start"
                          value={formData.start}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label for="end">Godzina zakończenia</Label>
                        <Input
                          type="time"
                          id="end"
                          name="end"
                          value={formData.end}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="classroom">Sala</Label>
                        <Input
                          type="text"
                          id="classroom"
                          name="classroom"
                          value={formData.classroom}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="description">Opis</Label>
                        <Input
                          type="text"
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="start_date">Data rozpoczęcia kursu</Label>
                        <Input
                          type="date"
                          id="start_date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="end_date">Data zakończenia kursu</Label>
                        <Input
                          type="date"
                          id="end_date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="subject_type_id">Typ</Label>
                        <Input
                          type="select"
                          id="subject_type_id"
                          name="subject_type_id"
                          value={formData.subject_type_id}
                          onChange={handleInputChange}
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
                    <Col md={6}>
                      <FormGroup>
                        <Label for="day">Dzień tygodnia</Label>
                        <Input
                          type="select"
                          id="day"
                          name="day"
                          value={formData.day}
                          onChange={handleInputChange}
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
                  <Button color="primary" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner size="sm" /> : "Dodaj zajęcia"}
                  </Button>
                  <Row>
                    <Col md={6}>
                      <p className="mt-2"><b>Uwaga! </b>Jeżeli przedmiotu, którego szukasz nie ma na liście, wpisz poniżej nazwę nowego kursu</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="newCourseName">Nowy przedmiot</Label>
                        <Input
                          type="text"
                          id="newCourseName"
                          name="newCourseName"
                          value={newCourseName}
                          onChange={handleNewCourseInputChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Button color="primary" onClick={handleAddNewCourse}>
                        Zapisz nowy przedmiot
                      </Button>
                    </Col>
                  </Row>
                  {isSuccessMessageVisible && (
                    <Row>
                      <Col md={6}>
                        <div className="alert alert-success">
                          Przedmiot został dodany pomyślnie!
                        </div>
                      </Col>
                    </Row>
                  )}
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddSubject;
