import axios from 'axios';

export const login = async (credentials) => {
    const {username, password} = credentials;
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/auth/login`, {
        username,
        password,
    });
    
    localStorage.setItem('token', response.data.token);
    return response.status;
};

export const register = async (credentials) => {
    const {username, password} = credentials;
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/auth/register`, {
        username,
        password
      });
      return response;
};

export const logout = async () => {
    localStorage.removeItem('token');
}