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
  PaginationLink,
} from "reactstrap";

import PanelHeader from "components/PanelHeader/PanelHeader.js";

function CurrentRequests() {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const token = localStorage.getItem("token");
  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    fetch("http://localhost:5000/request", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredData = data.filter(
          (request) => new Date(request.subject.date) >= new Date()
        );
        setRequests(filteredData);
      })
      .catch((error) => console.error("Błąd pobierania danych z API:", error));
  }, []);

  const isUserRequest = (request) => {
    return request.user.id === userId;
  };

  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const visibleRequests = requests.filter((request) => request.subject.visible);
  const currentRequests = visibleRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatTime = (timeString) => {
    const date = new Date(`1970-01-01T${timeString}`);
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  };

  const handleApplyRequest = async (request) => {
    const shouldApply = window.confirm(
      "Czy na pewno chcesz zgłosić się na to zastępstwo?"
    );
    if (!shouldApply) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const userId = JSON.parse(localStorage.getItem("user")).id;

      const addReplacementResponse = await fetch(
        "http://localhost:5000/replacement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            request_id: request.id,
          }),
        }
      );

      if (!addReplacementResponse.ok) {
        console.error("Dodawanie zastępstwa nie powiodło się.");
        return;
      }

      const subjectInfo = {
        description: request.subject.course.name,
        day: request.subject.day,
        start: request.subject.start,
        end: request.subject.end,
        classroom: request.subject.classroom,
        date: request.date,
        user_id: userId,
        course_id: request.subject.course.id,
        subject_type_id: request.subject.subject_type.id,
        visible: true,
      };

      const subjectToUpdateId = request.subject.id;
      const updateSubjectResponse = await fetch(
        `http://localhost:5000/subject/${subjectToUpdateId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(subjectInfo),
        }
      );

      if (!updateSubjectResponse.ok) {
        console.error("Aktualizacja planu zajęć nie powiodła się.");
        return;
      }
      console.log("Zgłoszenie zastępstwa dodane pomyślnie.");

      const updatedRequests = requests.map((r) =>
        r.id === request.id ? { ...r, status: "Confirmed" } : r
      );
      setRequests(updatedRequests);
    } catch (error) {
      console.error("Błąd podczas komunikacji z API:", error);
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
                <CardTitle tag="h4">Aktualne Prośby</CardTitle>
              </CardHeader>
              <CardBody>
                {currentRequests.length > 0 ? (
                  <Row>
                    {currentRequests
                      .filter((request) => request.subject.visible)
                      .map((request) => (
                        <Col key={request.id} md={6}>
                          <Card>
                            <CardBody>
                              <p>
                                <b>Data:</b> {request.date}
                              </p>
                              <p>
                                <b>Prowadzący:</b> {request.user.firstName}{" "}
                                {request.user.lastName}
                              </p>
                              <p>
                                <b>Przedmiot:</b> {request.subject.course.name}
                              </p>
                              <p>
                                <b>Godzina:</b>{" "}
                                {formatTime(request.subject.start)} -{" "}
                                {formatTime(request.subject.end)}
                              </p>
                              <p>
                                <b>Komentarz:</b> {request.comment}
                              </p>
                              <Button
                                color="primary"
                                className="mb-15"
                                disabled={isUserRequest(request)}
                                onClick={() => handleApplyRequest(request)}
                              >
                                Zgłoś się
                              </Button>
                            </CardBody>
                          </Card>
                        </Col>
                      ))}
                  </Row>
                ) : (
                  <p className="text-info h3 text-center">
                    Brak aktualnych próśb.
                  </p>
                )}
                <Pagination>
                  {[
                    ...Array(Math.ceil(visibleRequests.length / itemsPerPage)),
                  ].map((_, index) => (
                    <PaginationItem
                      key={index}
                      active={index + 1 === currentPage}
                    >
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                      >
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
