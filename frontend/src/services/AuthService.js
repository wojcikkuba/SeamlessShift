import isTokenExpired from '../utils/isTokenExpired';

class AuthService {
    static isAuthenticated() {
        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            return false;
        }
        return true;
    }

    static isTokenExpired(token) {
        const expirationDate = this.getTokenExpirationDate(token);
        return expirationDate < new Date();
    }

    static login(email, password) {
        return fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
             },
            body: JSON.stringify({ email, password }),
        }).then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return data.user;
            } else {
                throw new Error('Login failed');
            }
        });
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}

export default AuthService;
