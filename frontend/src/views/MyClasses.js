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
    Button,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";

/*
const thead = ["Godzina rozpoczęcia", "Godzina zakończenia", "Przedmiot", "Sala", "Typ", "Opis", "Zastępstwo"];

const tbody = [
  {
    data: ["8:15", "9:45", "Inżynieria baz danych", "CI 403C", "laboratorium", "IIST 6", "+"],
  },
  {
    data: ["8:15", "9:45", "Inżynieria baz danych", "CI 403C", "laboratorium", "IIST 6", "+"],
  },
  {
    data: ["8:15", "9:45", "Inżynieria baz danych", "CI 403C", "laboratorium", "IIST 6", "+"],
  },
  {
    data: ["8:15", "9:45", "Inżynieria baz danych", "CI 403C", "laboratorium", "IIST 6", "+"],
  },
  {
    data: ["8:15", "9:45", "Inżynieria baz danych", "CI 403C", "laboratorium", "IIST 6", "+"],
  },
];
*/

function MyClasses() {

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState([]);

    const fetchSubjects = async (userId, date) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found in local storage');
            }

            const response = await fetch(`http://localhost:5000/subject/${userId}/${date}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Add 'Bearer' prefix to the token value
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTableData(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Błąd pobierania danych z API:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            const selectedDate = '2023-11-17' // TEST
            const userId = 1; // TEST
            fetchSubjects(userId, selectedDate);
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
                                <CardTitle tag="h4">Moje zajęcia</CardTitle>
                            </CardHeader>
                            <CardBody>

                                <Label for="exampleDate">Data</Label>
                                <Input
                                    id="exampleDate"
                                    name="date"
                                    placeholder="Wybierz datę"
                                    type="date"
                                    onChange={handleDateChange}
                                />

                                {selectedDate && isLoading ? (
                                    <Spinner color="primary" /> // Pokazuje Spinner tylko po wybraniu daty i podczas ładowania danych
                                ) : selectedDate ? (
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
                                                    <td>{row.description}</td>
                                                    <td>{row.classroom}</td>
                                                    <td>{row.subject_type.type}</td>
                                                    <td>{row.course.name}</td>
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

export default MyClasses;