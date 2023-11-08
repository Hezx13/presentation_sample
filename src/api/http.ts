import axios from 'axios';

export const EXHIBITFLOW_API_URL = process.env.REACT_APP_BACKEND_ENDPOINT;

const http = axios.create({
  baseURL: EXHIBITFLOW_API_URL,
  withCredentials: true,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
