import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});
  

// Axios interceptor to attach token to outgoing requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); // Clear the expired token
      window.location.href = '/'; // Redirect to the login page
    }
    return Promise.reject(error);
});


export default instance;
