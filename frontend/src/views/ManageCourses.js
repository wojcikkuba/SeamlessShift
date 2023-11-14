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

function ManageCourses() {
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [noData, setNoData] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState({
      fromDate: "",
      toDate: "",
    });
    const [selectedUser, setSelectedUser] = useState("");
    const [users, setUsers] = useState([]);
  
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
  
    const fetchCourses = async (userId, fromDate, toDate) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/course/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        // Sprawdź, czy dane zawierają pole "subjects"
        if (!data.hasOwnProperty("subjects")) {
          throw new Error("Pole 'subjects' nie istnieje w danych z API.");
        }
  
        const subjects = data.subjects;
        
        let allSubjectOccurrences = [];
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        const daysBetween = Math.floor((toDateObj - fromDateObj) / (24 * 60 * 60 * 1000));
        
        for (let i = 0; i <= daysBetween; i++) {
            const currentDate = new Date(fromDateObj.getTime() + i * (24 * 60 * 60 * 1000));
            const dayOfWeek = currentDate.toLocaleString('en-us', { weekday: 'long' });
      
            subjects.forEach(subject => {
              if (subject.day === dayOfWeek) {
                // Create a copy of the subject with the current date
                let subjectOccurrence = { ...subject, date: currentDate.toISOString().split('T')[0] };
                allSubjectOccurrences.push(subjectOccurrence);
              }
            });
          }
  
        setTableData(allSubjectOccurrences);
        setFilteredData(allSubjectOccurrences);
      } catch (error) {
        console.error("Błąd pobierania danych z API:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const handleRowSelect = (subjectId) => {
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.includes(subjectId)) {
          return prevSelectedRows.filter((id) => id !== subjectId);
        } else {
          return [...prevSelectedRows, subjectId];
        }
      });
    };
  
    const handlePeriodChange = (e) => {
      const { name, value } = e.target;
      setSelectedPeriod((prevPeriod) => ({
        ...prevPeriod,
        [name]: value,
      }));
    };
  
    const handleUserChange = (e) => {
      const selectedUserId = e.target.value;
      setSelectedUser(selectedUserId);
      fetchCourses(selectedUserId, selectedPeriod.fromDate, selectedPeriod.toDate);
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
                      <Col md={3}>
                        <FormGroup>
                          <Label for="fromDate">Od</Label>
                          <Input
                            type="date"
                            id="fromDate"
                            name="fromDate"
                            value={selectedPeriod.fromDate}
                            onChange={handlePeriodChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="toDate">Do</Label>
                          <Input
                            type="date"
                            id="toDate"
                            name="toDate"
                            value={selectedPeriod.toDate}
                            onChange={handlePeriodChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
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
                      Brak zajęć do wyświetlenia
                    </p>
                  ) : (
                    <>
                      <Table responsive bordered>
                        <thead className="text-primary">
                          <tr>
                            <th>Przedmiot</th>
                            <th>Data</th>
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
                              <td>{subject.date}</td>
                              <td>{`${subject.start} - ${subject.end}`}</td>
                              <td>{subject.day}</td>
                              <td>{subject.classroom}</td>
                              <td>{subject.subject_type_id}</td>
                              <td>{subject.description}</td>
                              <td className="text-center">
                                <Button color="danger">Usuń</Button>
                                <Button color="info" className="ml-2">
                                  Edytuj
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <Row>
                        <Button color="primary" className="ml-2" >
                          Pobierz listę
                        </Button>
                      </Row>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
  
  export default ManageCourses;