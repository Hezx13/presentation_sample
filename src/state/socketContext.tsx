import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isLoggedIn] = useState(!!localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Check for token presence before establishing a connection
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      // Create socket connection
      const newSocket = io('http://localhost:4500', {
        query: {
          token,
          role
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join_room', role);
      });

      //@ts-expect-error
      setSocket(newSocket);

      // Cleanup on component unmount or token change
      return () => {
        newSocket.close();
      };
    }
  }, []); // Empty dependency array ensures this runs once at mount

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
