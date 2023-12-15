import http from "./http";
import { eventEmitter } from "../state/EventEmitter";

export const login = async (credentials) => {
    const {username, password} = credentials;
    const response = await http.post(`/auth/login`, {
        username,
        password,
    });
    
    localStorage.setItem('token', response.data.token);
    eventEmitter.emit('login');
    return response.status;
};

export const register = async (credentials) => {
    const {username, password, email, department} = credentials;
    const response = await http.post(`/auth/register`, {
        username,
        password,
        email,
        department,
      });
      return response;
};

export const logout = async () => {
    localStorage.removeItem('token');
    window.location.reload();
}

export const getUserData = async () => {
    try {
      const response = await http.get('/auth/user');
      return response.data;
    } catch (error: any) {
      console.error('Error while fetching user data:', error.response || error);
      throw new Error("Error while fetching user data.");
    }
  };
export const getUsers = async () => {
    try {
      const response = await http.get('/user/users');
      return response.data;
    } catch (error: any) {
      console.error('Error while fetching user data:', error.response || error);
      throw new Error("Error while fetching user data.");
    }
  };