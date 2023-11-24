import React, { useState, useEffect } from "react";

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Table,
    Row,
    Col,
    Input,
    Label,
    Spinner,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";

function Schedule() {

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [noData, setNoData] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Błąd pobierania danych z API:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleUserChange = (e) => {
        setSelectedUserId(e.target.value);
    }

    const fetchSubjects = async (userId, date) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/subject/${userId}/${date}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (Array.isArray(data) && data.length === 0) {
                setNoData(true);
            } else {
                const visibleData = data.filter((row) => row.visible);
                setTableData(visibleData);
                setNoData(visibleData.length === 0);
            }

        } catch (error) {
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (selectedDate && selectedUserId) {
            fetchSubjects(selectedUserId, selectedDate);
        }
    }, [selectedDate]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <>
            <PanelHeader size="sm" />
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Plany zajęć</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md={6}>
                                        <Label for="exampleUser">Użytkownik</Label>
                                        <Input
                                            type="select"
                                            name="user"
                                            id="exampleUser"
                                            onChange={handleUserChange}
                                        >
                                            <option value="">Wybierz użytkownika</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>
                                                    {user.firstName} {user.lastName} ({user.email})
                                                </option>
                                            ))}
                                        </Input>
                                    </Col>
                                    <Col md={6}>
                                        <Label for="exampleDate">Data</Label>
                                        <Input
                                            id="exampleDate"
                                            name="date"
                                            placeholder="Wybierz datę"
                                            type="date"
                                            onChange={handleDateChange}
                                        />
                                    </Col>
                                </Row>

                                {selectedDate && selectedUserId && isLoading ? (
                                    <Spinner color="primary" />
                                ) : selectedDate && selectedUserId && noData ? (
                                    <p className="text-info h4 text-center">Wskazana osoba nie prowadzi w danym dniu zajęć</p>
                                ) : selectedDate && selectedUserId ? (
                                    <Table responsive bordered>
                                        <thead className="text-primary">
                                            <tr>
                                                <th>Godzina rozpoczęcia</th>
                                                <th>Godzina zakończenia</th>
                                                <th>Przedmiot</th>
                                                <th>Sala</th>
                                                <th>Typ</th>
                                                <th>Opis</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td>{row.start}</td>
                                                    <td>{row.end}</td>
                                                    <td>{row.course.name}</td>
                                                    <td>{row.classroom}</td>
                                                    <td>{row.subject_type.type}</td>
                                                    <td>{row.description}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : null}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Schedule;