import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const newSocket = io(apiUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('⚡ Socket connected:', newSocket.id);

            // Auto-join personal room if logged in
            if (user?._id) {
                newSocket.emit('join', user._id);
            }
            // Admin auto-joins admin room
            if (user?.role === 'admin') {
                newSocket.emit('join_admin');
            }
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [apiUrl, user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
