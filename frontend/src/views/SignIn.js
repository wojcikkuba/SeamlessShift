import React, { useState } from 'react';
import AuthService from '../services/AuthService';

export default function SignIn() {
    const [loginError, setLoginError] = useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        AuthService.login(email, password)
            .then(user => {
                window.location.href = '/admin/dashboard';
            })
            .catch(error => {
                console.error('Login error', error);
                setLoginError('Nieprawidłowe dane logowania. Spróbuj ponownie.');
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="text-center">Logowanie</h1>
                        </div>
                        <div className="card-body">
                            {loginError && (
                                <div className="alert alert-danger text-center" role="alert">
                                    {loginError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">E-mail</label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Hasło</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        id="password"
                                        name="password"
                                        required
                                    />
                                </div>
                                <div className='text-center'>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Zaloguj się
                                </button>
                                </div>
                                <div className="text-center mt-3">
                                    <a href="#" className="text-decoration-none">Przypomnij hasło</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
