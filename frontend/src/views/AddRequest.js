import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Input,
    Label,
    FormGroup,
    Button,
    Spinner,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";

function AddRequest() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialDate = searchParams.get("date");
    const initialSubjectId = searchParams.get("subjectId")

    const [selectedDate, setSelectedDate] = useState(initialDate || "");
    const [selectedSubjects, setSelectedSubjects] = useState(initialSubjectId ? [initialSubjectId] : []);
    const [subjects, setSubjects] = useState([]);
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setSelectedDate(initialDate || "");
        setSelectedSubjects(initialSubjectId ? [initialSubjectId] : []);
    }, [initialDate, initialSubjectId]);

    const fetchUserSubjectsForDate = async (userId, date) => {
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
            setSubjects(data);
        } catch (error) {
            console.error('Błąd pobierania danych z API:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedDate) {
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData.id;
            fetchUserSubjectsForDate(userId, selectedDate);
        }
    }, [selectedDate]);

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setSelectedDate(selectedDate);
        setSelectedSubjects([]); // Usuń wybrane przedmioty po zmianie daty
    };

    const handleSubjectChange = (e) => {
        const selectedOptionValues = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedSubjects(selectedOptionValues);
    };

    const handleCommentChange = (e) => {
        const comment = e.target.value;
        setComment(comment);
    };

    const handleAddRequest = () => {
        if (selectedSubjects.length > 0) {
            // Tutaj wykonaj odpowiednie działania po naciśnięciu przycisku "Dodaj prośbę"
            // Możesz użyć stanów selectedDate, selectedSubjects oraz comment do przesłania danych do API lub do wykonania innych działań.
            console.log("Dodaj prośbę:", selectedDate, selectedSubjects, comment);
        } else {
            console.log("Wybierz przynajmniej jeden przedmiot przed dodaniem prośby.");
        }
    };

    return (
        <>
            <PanelHeader size="sm" />
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Dodaj Prośbę</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <FormGroup>
                                    <Label for="exampleDate">Data</Label>
                                    <Input
                                        id="exampleDate"
                                        name="date"
                                        placeholder="Wybierz datę"
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                    />
                                </FormGroup>
                                {isLoading ? (
                                    <Spinner color="primary" />
                                ) : selectedDate && subjects.length === 0 ? (
                                    <p className="text-info h4 text-center">Brak zajęć w danym dniu</p>
                                ) : selectedDate ? (
                                    <FormGroup>
                                        <Label for="exampleSubjects">Przedmioty</Label>
                                        <Input
                                            id="exampleSubjects"
                                            name="subjects"
                                            type="select"
                                            multiple
                                            value={selectedSubjects}
                                            onChange={handleSubjectChange}
                                        >
                                            {subjects.map((subject) => (
                                                <option key={subject.id} value={subject.id}>
                                                    {subject.course.name}
                                                </option>
                                            ))}
                                        </Input>
                                    </FormGroup>
                                ) : null}
                                <FormGroup>
                                    <Label for="exampleComment">Komentarz</Label>
                                    <Input
                                        id="exampleComment"
                                        name="comment"
                                        placeholder="Dodaj komentarz"
                                        type="textarea"
                                        value={comment}
                                        onChange={handleCommentChange}
                                    />
                                </FormGroup>
                                <Button color="primary" onClick={handleAddRequest} disabled={selectedSubjects.length === 0}>
                                    Dodaj Prośbę
                                </Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default AddRequest;
