import React, { useState } from 'react';
import AuthService from '../services/AuthService';
import { Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Input,
    FormGroup,
    Button,
    Spinner,
} from 'reactstrap';

export default function ChangePassword() {
    const [changePasswordError, setChangePasswordError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const currentPassword = data.get('currentPassword');
        const newPassword = data.get('newPassword');
        const confirmNewPassword = data.get('confirmNewPassword');

        if (newPassword !== confirmNewPassword) {
            setChangePasswordError('Nowe hasło i potwierdzenie hasła nie pasują do siebie.');
            return;
        }

        const currentUserEmail = JSON.parse(localStorage.getItem('user')).email;

        const changePasswordData = {
            email: currentUserEmail,
            old_password: currentPassword,
            new_password: newPassword,
        };

        AuthService.changePassword(changePasswordData)
            .then(() => {
                console.log('Hasło zostało pomyślnie zmienione.');
            })
            .catch((error) => {
                console.error('Change password error', error);
                setChangePasswordError('Nieprawidłowe dane do zmiany hasła. Spróbuj ponownie.');
            });
    };

    const returnPath = `/${AuthService.isAdmin() ? 'admin' : 'user'}/user-page`;

    return (
        <div className="content">
            <Row>
                <Col xs={12} md={6} className="mx-auto">
                    <Card className="card-login">
                        <CardHeader className="text-center">
                            <CardTitle tag="h4">Zmiana hasła</CardTitle>
                        </CardHeader>
                        <CardBody>
                            {changePasswordError && (
                                <div className="alert alert-danger text-center" role="alert">
                                    {changePasswordError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        placeholder="Obecne hasło (min 8 znakow)"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        placeholder="Nowe hasło"
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        type="password"
                                        id="confirmNewPassword"
                                        name="confirmNewPassword"
                                        placeholder="Potwierdź nowe hasło"
                                        required
                                    />
                                </FormGroup>
                                <div className="text-center">
                                    <Button type="submit" color="primary">
                                        Zapisz zmiany
                                    </Button>
                                    <Link to={returnPath} className="btn btn-secondary ml-2">
                                        Powrót
                                    </Link>
                                </div>
                            </form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
