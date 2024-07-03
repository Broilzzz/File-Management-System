
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/';

const AuthService = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/auth/signin`, credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      throw new Error('Login failed');
    }
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default AuthService;
