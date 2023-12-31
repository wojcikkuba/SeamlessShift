import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Label,
  Button,
  Input,
} from "reactstrap";
import DatePicker from "react-datepicker";
import { Pie } from "react-chartjs-2";
import * as XLSX from "xlsx";
import "react-datepicker/dist/react-datepicker.css";
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import { registerLocale } from "react-datepicker";
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function ReportsAdmin() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [userReplacements, setUserReplacements] = useState([]);
  const [answeredRequestsCount, setAnsweredRequestsCount] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    fetchUsersList();
  }, []);

  const fetchUsersList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/user`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Users List:", data);

      // Ustaw listę użytkowników
      setUsersList(data);
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    }
  };

  const fetchUserRequests = async (userId, start, end) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/request/user/${userId}`,
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
      console.log("User Requests:", data);

      if (Array.isArray(data)) {
        const filteredRequests = data.filter(
          (request) =>
            new Date(request.issue_date) >= start &&
            new Date(request.issue_date) <= end
        );
        setUserRequests(filteredRequests);
      } else {
        console.error("Odpowiedź z API nie jest tablicą:", data);
      }
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    }
  };

  const fetchUserReplacements = async (userId, start, end) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/replacement`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User Replacements:", data);

      if (Array.isArray(data)) {
        const userReplacements = data.filter(
          (replacement) =>
            replacement.user_id === userId &&
            new Date(replacement.request.issue_date) >= start &&
            new Date(replacement.request.issue_date) <= end
        );
        setUserReplacements(userReplacements);
      } else {
        console.error("Odpowiedź z API nie jest tablicą:", data);
      }
    } catch (error) {
      console.error("Błąd pobierania danych z API:", error);
    }
  };

  const handleGenerateReport = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData.id;

    if (selectedUser && startDate && endDate) {
      fetchUserRequests(selectedUser.id, startDate, endDate);
      fetchUserReplacements(selectedUser.id, startDate, endDate);
      setChartVisible(true);
    }
  };

  const handleDownloadReport = () => {
    if (selectedUser && startDate && endDate && reportData) {
      const userName = `${selectedUser.firstName} ${selectedUser.lastName}`;
      const userEmail = selectedUser.email;

      const exportData = [
        [
          "Imię",
          "Nazwisko",
          "E-mail",
          "Data początkowa",
          "Data końcowa",
          "Liczba zgłoszonych prośb",
          "Liczba podjętych zastępstw",
          "Liczba odpowiedzi na zgłoszenia użytkownika",
        ],
        [
          selectedUser.firstName,
          selectedUser.lastName,
          selectedUser.email,
          formatDate(startDate),
          formatDate(endDate),
          reportData.userRequestsCount,
          reportData.userReplacementsCount,
          reportData.answeredRequestsCount,
        ],
      ];

      const ws = XLSX.utils.aoa_to_sheet(exportData);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Raport");
      XLSX.writeFile(wb, `Raport_${userName}_${userEmail}.xlsx`);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("pl-PL", options).format(date);
  };

  useEffect(() => {
    console.log("userRequests:", userRequests);
    console.log("userReplacements:", userReplacements);

    const answeredRequests = userRequests.filter(
      (request) => request.status !== "Requested"
    );
    setAnsweredRequestsCount(answeredRequests.length);

    const reportData = {
      userRequestsCount: userRequests.length,
      userReplacementsCount: userReplacements.length,
      answeredRequestsCount,
    };
    setReportData(reportData);
  }, [userRequests, userReplacements, answeredRequestsCount]);

  const chartData = reportData
    ? {
        labels: [
          "Liczba zgłoszonych prośb",
          "Liczba podjętych zastępstw",
          "Liczba odpowiedzi na zgłoszenia użytkownika",
        ],
        datasets: [
          {
            data: [
              reportData.userRequestsCount,
              reportData.userReplacementsCount,
              reportData.answeredRequestsCount,
            ],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      }
    : null;

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Raporty</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={4}>
                    <Label for="userSelect" className="mr-2">
                      Wybierz pracownika:
                    </Label>
                    <Input
                      type="select"
                      name="userSelect"
                      id="userSelect"
                      onChange={(e) =>
                        setSelectedUser(
                          usersList.find((user) => user.id === +e.target.value)
                        )
                      }
                    >
                      <option value="">Wybierz pracownika</option>
                      {usersList.map((user) => (
                        <option key={user.id} value={user.id}>
                          {`${user.firstName} ${user.lastName} | ${user.email}`}
                        </option>
                      ))}
                    </Input>
                  </Col>

                  <Col md={2}>
                    <Label for="startDate" className="mr-2">
                      Data początkowa:
                    </Label>
                    <DatePicker
                      id="startDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      className="form-control"
                      dateFormat="dd.MM.yyyy"
                      locale="pl"
                    />
                  </Col>
                  <Col md={2}>
                    <Label for="endDate" className="mr-2">
                      Data końcowa:
                    </Label>
                    <DatePicker
                      id="endDate"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      className="form-control"
                      dateFormat="dd.MM.yyyy"
                      locale="pl"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <Button
                      color="primary"
                      onClick={handleGenerateReport}
                      disabled={!selectedUser || !startDate || !endDate}
                    >
                      Generuj raport
                    </Button>
                  </Col>
                </Row>
                {chartVisible ? (
                  <>
                    <Row className="mt-4">
                      <Col md={12} className="text-center">
                        {userReplacements.length === 0 ? (
                          <p>
                            Brak danych o prośbach i zastępstwach w wybranym
                            okresie.
                          </p>
                        ) : (
                          <p className="text-info h4">
                            Statystyki dotyczące zastępstw
                          </p>
                        )}
                      </Col>
                    </Row>
                    {userReplacements.length > 0 && (
                      <Row>
                        <Col md={12}>
                          <Pie
                            data={chartData}
                            options={{
                              maintainAspectRatio: false,
                              responsive: true,
                            }}
                          />
                        </Col>
                      </Row>
                    )}
                    <Row className="mt-2">
                      <Col md={6}>
                        {userReplacements.length > 0 && (
                          <Button
                            color="primary"
                            onClick={handleDownloadReport}
                            disabled={!chartVisible}
                          >
                            Pobierz raport (Excel)
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </>
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ReportsAdmin;
