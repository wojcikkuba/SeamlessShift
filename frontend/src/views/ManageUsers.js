import React, { useState, useEffect } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Table,
    Row,
    Col,
    Spinner,
    Button,
    Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';

import PanelHeader from "components/PanelHeader/PanelHeader.js";

function ManageUsers() {
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [noData, setNoData] = useState(true);
    const [sortDirection, setSortDirection] = useState("ascending");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/user", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length === 0) {
                setNoData(true);
            } else {
                setTableData(data);
                setFilteredData(data);
                setNoData(false);
            }
        } catch (error) {
            console.error("Błąd pobierania danych z API:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRowSelect = (userId) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.includes(userId)) {
                return prevSelectedRows.filter((id) => id !== userId);
            } else {
                return [...prevSelectedRows, userId];
            }
        });
    };

    const handleSort = () => {
        setSortDirection((prevDirection) =>
            prevDirection === "ascending" ? "descending" : "ascending"
        );
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filteredUsers = tableData.filter(
            (user) =>
                user.firstName.toLowerCase().includes(e.target.value.toLowerCase()) ||
                user.lastName.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFilteredData(filteredUsers);
    };

    const sortedData = () => {
        const sortableData = [...filteredData];
        sortableData.sort((a, b) => {
            if (a.firstName < b.firstName) {
                return sortDirection === "ascending" ? -1 : 1;
            }
            if (a.firstName > b.firstName) {
                return sortDirection === "ascending" ? 1 : -1;
            }
            return 0;
        });
        return sortableData;
    };

    const exportToExcel = () => {
        const processedData = tableData.map(user => {
            const { deleted, facility_id, role_id, password_change_required, ...rest } = user;
            return {
                ...rest,
                facility: user.facility.name,
                role: user.role.name,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(processedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

        XLSX.writeFile(workbook, 'users_list.xlsx');
    };

    return (
        <>
            <PanelHeader size="sm" />
            <div className="content">
                <Row>
                    <Col xs={12}>
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h4">Zarządzanie użytkownikami</CardTitle>
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-3">
                                    <Col md={4}>
                                        <Input
                                            type="text"
                                            placeholder="Szukaj użytkownika"
                                            value={searchTerm}
                                            onChange={handleSearch}
                                        />
                                    </Col>
                                </Row>
                                {isLoading ? (
                                    <Spinner color="primary" />
                                ) : noData ? (
                                    <p className="text-info h4 text-center">
                                        Brak użytkowników do wyświetlenia
                                    </p>
                                ) : (
                                    <Table responsive bordered>
                                        <thead className="text-primary">
                                            <tr>
                                                <th>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRows.length === filteredData.length}
                                                        onChange={() =>
                                                            setSelectedRows(
                                                                selectedRows.length === filteredData.length
                                                                    ? []
                                                                    : filteredData.map((row) => row.id)
                                                            )
                                                        }
                                                    />
                                                </th>
                                                <th onClick={handleSort}>
                                                    Użytkownik
                                                    <i
                                                        className={`ml-1 fas fa-sort-${sortDirection === "ascending" ? "up" : "down"
                                                            }`}
                                                    ></i>
                                                </th>
                                                <th>E-mail</th>
                                                <th>Telefon</th>
                                                <th>Rola</th>
                                                <th className="text-center">Akcje</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedData().map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRows.includes(row.id)}
                                                            onChange={() => handleRowSelect(row.id)}
                                                        />
                                                    </td>
                                                    <td>{row.firstName} {row.lastName}</td>
                                                    <td>{row.email}</td>
                                                    <td>{row.phone}</td>
                                                    <td>{row.role.name}</td>
                                                    <td className="text-center">
                                                        <Button color="danger">Usuń</Button>
                                                        {/*<Link to="/admin/edit-user">*/}
                                                            <Button color="info" className="ml-2">
                                                                Edytuj
                                                            </Button>
                                                        {/*</Link>*/}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                                <Row>
                                    <Link to="/admin/add-user">
                                        <Button color="primary" className="ml-3">
                                            Dodaj użytkownika
                                        </Button>
                                    </Link>
                                    <Button color="primary" className="ml-2" onClick={exportToExcel}>
                                        Pobierz listę
                                    </Button>
                                    <Button
                                        color="primary"
                                        className="ml-2"
                                        onClick={() =>
                                            console.log(
                                                "Delete Selected button clicked",
                                                selectedRows
                                            )
                                        }
                                    >
                                        Usuń zaznaczone
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

export default ManageUsers;
