import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";

function CurrentRequests() {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // Tutaj możemy pobrać aktualne prośby z API i ustawić je w stanie requests
        // Przykładowe zapytanie do API:
        // fetch("http://localhost:5000/requests")
        //   .then((response) => response.json())
        //   .then((data) => setRequests(data))
        //   .catch((error) => console.error("Błąd pobierania danych z API:", error));
    }, []); // Użyj pustej tablicy zależności, aby useEffect wykonał się tylko raz po zamontowaniu komponentu

    return (
        <>
            <PanelHeader size="sm" />
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Aktualne Prośby</CardTitle>
                            </CardHeader>
                            <CardBody>
                                {requests.length > 0 ? (
                                    <Carousel showArrows={true} showStatus={false} showThumbs={false}>
                                        {requests.map((request) => (
                                            <div key={request.id}>
                                                <h3>{request.subjectName}</h3>
                                                <p>{request.description}</p>
                                                {/* Dodaj więcej informacji o prośbie, jeśli jest to konieczne */}
                                            </div>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <p className="text-info h3 text-center">Brak aktualnych próśb.</p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default CurrentRequests;
