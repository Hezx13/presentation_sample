import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppState } from './AppStateContext';
import { editTask } from './actions';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isLoggedIn] = useState(!!localStorage.getItem('token'));
  const [socket, setSocket] = useState(null);
  const {dispatch} = useAppState()

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


  useEffect(()=>{
    //@ts-expect-error
    socket?.on('receive_updated_materials',(data)=>{
      dispatch(editTask(
          data.material.id,
          data.projectId,
          data.material.text,
          data.material.article,
          data.material.price,
          data.material.quantity,
          data.material.date,
          data.material.unit,
          data.material.comment,
          data.material.deliveryDate,
          data.material.orderedBy,
          data.material.status,
          data.material.payment,
          false
      ))
    })
  },[socket])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
