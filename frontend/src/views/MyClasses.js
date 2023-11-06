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

function MyClasses() {

    const [selectedDate, setSelectedDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (selectedDate) {
            // Symulacja ładowania danych z API po wybraniu daty
            setIsLoading(true);

            // Symulacja pobierania danych z API po wybraniu daty
            setTimeout(() => {
                setTableData(tbody);
                setIsLoading(false); // Ustawiamy isLoading na false po pobraniu danych
            }, 2000); // Symulujemy czas trwania żądania do API jako 2 sekundy
        }
    }, [selectedDate]); // Używamy selectedDate jako zależności, aby efekt useEffect działał po zmianie daty

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
                                                {thead.map((prop, key) => {
                                                    if (key === thead.length - 1)
                                                        return (
                                                            <th key={key} className="text-center">
                                                                {prop}
                                                            </th>
                                                        );
                                                    return <th key={key}>{prop}</th>;
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    {row.data.map((cell, cellIndex) => (
                                                        <td key={cellIndex}>
                                                            {cellIndex === thead.length - 1 ? (
                                                                <Button color="primary" onClick={() => handleButtonClick(row)}>Dodaj</Button>
                                                            ) : (
                                                                cell
                                                            )}
                                                        </td>
                                                    ))}
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