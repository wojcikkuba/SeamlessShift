import React from 'react';
import AuthService from '../services/AuthService';

export default function SignIn() {
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
            });
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Sign in</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="email" style={{ display: 'block', marginBottom: '.5rem' }}>Email Address</label>
                    <input
                        style={{ width: '100%', padding: '.5rem' }}
                        type="email"
                        id="email"
                        name="email"
                        required
                        autoFocus
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '.5rem' }}>Password</label>
                    <input
                        style={{ width: '100%', padding: '.5rem' }}
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <input type="checkbox" id="remember-me" name="remember" value="remember" />
                    <label htmlFor="remember-me" style={{ marginLeft: '.5rem' }}>Remember me</label>
                </div>
                <button
                    type="submit"
                    style={{ width: '100%', padding: '.75rem', marginBottom: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Sign In
                </button>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <a href="#" style={{ textDecoration: 'none' }}>Forgot password?</a>
                </div>
            </form>
            <footer style={{ textAlign: 'center', marginTop: '2rem' }}>
                <p>
                    Copyright © 
                    <a href="https://mui.com/" style={{ textDecoration: 'none' }}> Your Website </a> 
                    {new Date().getFullYear()}.
                </p>
            </footer>
        </div>
    );
}
