import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  CardTitle,
} from "reactstrap";
import { Link } from "react-router-dom";
import PanelHeader from "components/PanelHeader/PanelHeader.js";

function User() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    phone: "",
    department: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user")).id;

    fetch(`http://localhost:5000/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role.name,
          email: data.email,
          phone: data.phone,
          department: data.facility.name,
        });
      })
      .catch((error) => console.error("Błąd pobierania danych z API:", error));
  }, []);

  return (
    <>
      <PanelHeader size="sm" />
      <div className="content">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Moje konto</CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Imię</label>
                        <Input
                          type="text"
                          value={userData.firstName}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Nazwisko</label>
                        <Input type="text" value={userData.lastName} disabled />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Rola</label>
                        <Input type="text" value={userData.role} disabled />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label htmlFor="exampleInputEmail1">E-mail</label>
                        <Input type="email" value={userData.email} disabled />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>Telefon</label>
                        <Input type="phone" value={userData.phone} disabled />
                      </FormGroup>
                    </Col>
                    <Col className="pl-1" md="6">
                      <FormGroup>
                        <label>Zakład</label>
                        <Input
                          type="text"
                          value={userData.department}
                          disabled
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <div className="text-center mt-3">
                    <Link to="/change-password">Zmień hasło</Link>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
