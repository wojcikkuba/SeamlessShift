import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Row,
  Col,
  Spinner,
  Button,
  Input,
  FormGroup,
  Label,
  Form,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";
import { Link, useNavigate, useLocation } from "react-router-dom";

function ManageSubjects() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [noData, setNoData] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    location?.state?.selectedDate || ""
  );
  const [selectedUser, setSelectedUser] = useState(
    location?.state?.selectedUser || ""
  );
  const [users, setUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
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

      if (data.length === 0) {
        setNoData(true);
      } else {
        setUsers(data);
        setNoData(false);
      }
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async (userId, date) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/subject/${userId}/${date}`,
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
        throw new Error("Dane z API nie są tablicą.");
      }

      setTableData(data);
      setFilteredData(data);
      setNoData(data.length === 0);
      setShowTable(data.length > 0);
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedDate && selectedUser) {
      fetchCourses(selectedUser, selectedDate);
    }
  }, [selectedDate, selectedUser]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    fetchCourses(selectedUser, selectedDate);
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    setSelectedUser(selectedUserId);
    fetchCourses(selectedUserId, selectedDate);
  };

  const handleEditClick = (subjectId) => {
    navigate(`/admin/edit-subject/${subjectId}`);
  };

  const handleDeleteClick = async (subjectId) => {
    const shouldDelete = window.confirm(
      "Czy na pewno chcesz usunąć ten przedmiot?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/subject/${subjectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTableData((prevTableData) =>
        prevTableData.filter((subject) => subject.id !== subjectId)
      );
      setFilteredData((prevFilteredData) =>
        prevFilteredData.filter((subject) => subject.id !== subjectId)
      );

      const hasSubjects = filteredData.some(
        (subject) => subject.id !== subjectId
      );

      if (hasSubjects) {
        console.log(`Subject with ID ${subjectId} deleted successfully!`);
      } else {
        console.log("Wszystkie zajęcia zostały usunięte w danym dniu.");
        setNoData(true);
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const translateDayOfWeek = (dayOfWeek) => {
    const daysOfWeek = {
      Monday: "Poniedziałek",
      Tuesday: "Wtorek",
      Wednesday: "Środa",
      Thursday: "Czwartek",
      Friday: "Piątek",
      Saturday: "Sobota",
      Sunday: "Niedziela",
    };

    return daysOfWeek[dayOfWeek] || dayOfWeek;
  };

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Zarządzanie planem zajęć</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row className="mb-3">
                    <Col md={6}>
                      <FormGroup>
                        <Label for="date">Data</Label>
                        <Input
                          type="date"
                          id="date"
                          name="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label for="userSelect">Pracownik</Label>
                        <Input
                          type="select"
                          id="userSelect"
                          name="userSelect"
                          value={selectedUser}
                          onChange={handleUserChange}
                        >
                          <option value="" disabled>
                            Wybierz pracownika
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
                </Form>
                {isLoading ? (
                  <Spinner color="primary" />
                ) : noData ? (
                  <p className="text-info h4 text-center">
                    {selectedUser
                      ? "Brak zajęć danego użytkownika w wybranym dniu"
                      : "Brak zajęć do wyświetlenia"}
                  </p>
                ) : showTable ? (
                  <>
                    <Table responsive bordered className="text-center">
                      <thead className="text-primary">
                        <tr>
                          <th>Przedmiot</th>
                          <th>Godzina</th>
                          <th>Dzień tygodnia</th>
                          <th>Sala</th>
                          <th>Typ</th>
                          <th>Opis</th>
                          <th className="text-center">Akcje</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((subject, rowIndex) => (
                          <tr key={rowIndex}>
                            <td>{subject.course.name}</td>
                            <td>{`${subject.start.slice(
                              0,
                              5
                            )} - ${subject.end.slice(0, 5)}`}</td>
                            <td>{translateDayOfWeek(subject.day)}</td>
                            <td>{subject.classroom}</td>
                            <td>{subject.subject_type.type}</td>
                            <td>{subject.description}</td>
                            <td className="text-center">
                              <Button
                                color="danger"
                                onClick={() => handleDeleteClick(subject.id)}
                              >
                                Usuń
                              </Button>
                              <Button
                                color="info"
                                className="ml-2"
                                onClick={() => handleEditClick(subject.id)}
                              >
                                Edytuj
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                ) : null}
                <Row>
                  <Link to="/admin/add-subject">
                    <Button color="primary" className="ml-3">
                      Dodaj zajęcia
                    </Button>
                  </Link>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ManageSubjects;
