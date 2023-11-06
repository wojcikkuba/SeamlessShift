import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true; // If there's an error decoding, assume it's expired
  }
};

export default isTokenExpired;
