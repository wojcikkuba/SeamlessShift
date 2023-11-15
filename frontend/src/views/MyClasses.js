import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

function MyClasses() {

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [noData, setNoData] = useState(true);

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
                setTableData(data);
                setNoData(false);
            }

        } catch (error) {
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (selectedDate) {
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData.id;
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
                                    <Spinner color="primary" />
                                ) : selectedDate && noData ? (
                                    <p className="text-info h4 text-center">Brak zajęć w danym dniu</p>
                                ) : selectedDate ? (
                                    <Table responsive bordered className="text-center">
                                        <thead className="text-primary">
                                            <tr>
                                                <th>Godzina rozpoczęcia</th>
                                                <th>Godzina zakończenia</th>
                                                <th>Przedmiot</th>
                                                <th>Sala</th>
                                                <th>Typ</th>
                                                <th>Opis</th>
                                                <th className="text-center">Zastępstwo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td>{row.start.slice(0,5)}</td>
                                                    <td>{row.end.slice(0,5)}</td>
                                                    <td>{row.description}</td>
                                                    <td>{row.classroom}</td>
                                                    <td>{row.subject_type.type}</td>
                                                    <td>{row.course.name}</td>
                                                    <td className="text-center" >
                                                        <Link
                                                            to={{
                                                                pathname: "/admin/add-request",
                                                                search: `?date=${selectedDate}&subjectId=${row.id}`,
                                                            }}
                                                        >
                                                            <Button color="primary">Dodaj</Button>
                                                        </Link>
                                                    </td>
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