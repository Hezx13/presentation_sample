import http from "./http";

export const login = async (credentials) => {
    const {username, password} = credentials;
    const response = await http.post(`/auth/login`, {
        username,
        password,
    });
    
    localStorage.setItem('token', response.data.token);
    return response.status;
};

export const register = async (credentials) => {
    const {username, password} = credentials;
    const response = await http.post(`/auth/register`, {
        username,
        password
      });
      return response;
};

export const logout = async () => {
    localStorage.removeItem('token');
    window.location.reload();
}

export const getUserData = async () => {
    try {
      const response = await http.get('/auth/user'); // No need for additional headers, token is sent in interceptor
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error while fetching user data:', error.response || error);
      throw new Error("Error while fetching user data.");
    }
  };