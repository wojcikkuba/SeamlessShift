import React, { useState, useEffect } from "react";
import {
    Button,
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
import { emailPattern, phonePattern, firstNamePattern, lastNamePattern } from "../utils/patterns"
//import PanelHeader from "components/PanelHeader/PanelHeader.js";

function AddUser() {
    const [userData, setUserData] = useState({
        password: "password",
        firstName: "",
        lastName: "",
        role_id: "", // Changed to an empty string
        email: "",
        phone: "",
        facility_id: "", // Changed to an empty string
        deleted: false,
        password_change_required: false,
    });
    const [facilities, setFacilities] = useState([]);
    const [roles, setRoles] = useState([]);
    const token = localStorage.getItem("token");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");

    useEffect(() => {
        const fetchFacilities = async () => {
            try {

                const response = await fetch("http://localhost:5000/facility", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setFacilities(data);
            } catch (error) {
                console.error("Error fetching facilities from API:", error);
            }
        };

        fetchFacilities();
    }, []);

    useEffect(() => {
        const fetchRoles = async () => {
            try {

                const response = await fetch("http://localhost:5000/role", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error("Error fetching roles from API:", error);
            }
        };

        fetchRoles();
    }, []);

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setUserData({ ...userData, email });
        setEmailError(emailPattern.test(email) ? "" : "Invalid email address");
    };

    const handlePhoneChange = (e) => {
        const phone = e.target.value;
        setUserData({ ...userData, phone });
        setPhoneError(phonePattern.test(phone) ? "" : "Invalid phone number");
    };

    const handleFirstNameChange = (e) => {
        const firstName = e.target.value;
        setUserData({ ...userData, firstName });
        setFirstNameError(firstNamePattern.test(firstName) ? "" : "Invalid first name");
    }

    // Aktualizacja stanu przy wyborze roli
    const handleRoleChange = (e) => {
        setUserData({ ...userData, role_id: e.target.value });
    };

    // Aktualizacja stanu przy wyborze zakładu
    const handleFacilityChange = (e) => {
        setUserData({ ...userData, facility_id: e.target.value });
    };

    const handleLastNameChange = (e) => {
        const lastName = e.target.value;
        setUserData({ ...userData, lastName });
        setLastNameError(lastNamePattern.test(lastName) ? "" : "Invalid last name");
    }

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...userData,
                    role_id: parseInt(userData.role_id),
                    facility_id: parseInt(userData.facility_id)
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("User added successfully!");
        } catch (error) {
            console.error("Error adding user:", error);
        }
    };

    return (
        <>
            {/*<PanelHeader size="sm" />*/}
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Dodaj nowego użytkownika</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label>Imię</label>
                                                <Input
                                                    type="text"
                                                    onChange={handleFirstNameChange}
                                                    invalid={!!firstNameError}
                                                />
                                                <span className="text-danger">{firstNameError}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label>Nazwisko</label>
                                                <Input
                                                    type="text"
                                                    onChange={handleLastNameChange}
                                                    invalid={!!lastNameError}
                                                />
                                                <span className="text-danger">{lastNameError}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label>Rola</label>
                                                <Input type="select" onChange={handleRoleChange}>
                                                    <option value="" disabled>Wybierz rolę</option>
                                                    {roles.map((role) => (
                                                        <option key={role.id} value={role.id}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label htmlFor="exampleInputEmail1">E-mail</label>
                                                <Input
                                                    type="email"
                                                    onChange={handleEmailChange}
                                                    invalid={!!emailError}
                                                />
                                                <span className="text-danger">{emailError}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label>Telefon</label>
                                                <Input
                                                    type="phone"
                                                    onChange={handlePhoneChange}
                                                    invalid={!!phoneError}
                                                />
                                                <span className="text-danger">{phoneError}</span>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className="pr-1" md="6">
                                            <FormGroup>
                                                <label>Zakład</label>
                                                <Input type="select" onChange={handleFacilityChange}>
                                                    <option value="" disabled>Wybierz zakład</option>
                                                    {facilities.map((facility) => (
                                                        <option key={facility.id} value={facility.id}>
                                                            {facility.name}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                                <Row>
                                    <Link to="/admin/manage-users">
                                        <Button color="primary" className="ml-3">
                                            Powrót
                                        </Button>
                                    </Link>
                                    <Button color="success" className="ml-2" onClick={handleSaveChanges}>
                                        Zapisz zmiany
                                    </Button>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default AddUser;
