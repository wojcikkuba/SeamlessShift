import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Button,
    Pagination,
    PaginationItem,
    PaginationLink
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";

function CurrentRequests() {
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const token = localStorage.getItem('token');
    useEffect(() => {
        fetch("http://localhost:5000/request", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
           .then((response) => response.json())
           .then((data) => setRequests(data))
           .catch((error) => console.error("Błąd pobierania danych z API:", error));
    }, []);

    const indexOfLastRequest = currentPage * itemsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
    const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                                {currentRequests.length > 0 ? (
                                    <Row>
                                        {currentRequests.map((request) => (
                                            <Col key={request.id} md={6}>
                                                <Card >
                                                    <CardBody>
                                                        <p><b>Użytkownik:</b> {request.user.firstName} {request.user.lastName}</p>
                                                        <p><b>Komentarz:</b> {request.comment}</p>
                                                        <p><b>Przedmiot:</b> {request.subject.id}</p>
                                                        <p><b>Data:</b> {request.date}</p>
                                                        <Button color="primary" className="mb-15">Zgłoś się</Button>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                ) : (
                                    <p className="text-info h3 text-center">Brak aktualnych próśb.</p>
                                )}
                                <Pagination>
                                    {[...Array(Math.ceil(requests.length / itemsPerPage))].map((_, index) => (
                                        <PaginationItem key={index} active={index + 1 === currentPage}>
                                            <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default CurrentRequests;
