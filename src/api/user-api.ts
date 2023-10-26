import axios from 'axios';

export const login = async (credentials) => {
    const {username, password} = credentials;
    const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_ENDPOINT}/auth/login`, {
        username,
        password,
    });
    localStorage.setItem('token', data.token);
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