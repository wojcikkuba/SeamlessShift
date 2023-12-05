import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RestorePassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage('');

        try {
            const response = await fetch('http://localhost:5000/restore-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('Hasło czasowe zostało wysłane');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setMessage('Wystąpił błąd. Spróbuj ponownie.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h1 className="text-center">Przywróć hasło</h1>
                        </div>
                        <div className="card-body">
                            {message && (
                                <div className="alert alert-success text-center" role="alert">
                                    {message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        E-mail
                                    </label>
                                    <input
                                        className="form-control"
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">
                                        Przywróć hasło
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
