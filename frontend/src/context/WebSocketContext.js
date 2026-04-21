import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const clientRef = React.useRef(null);

    const connect = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("WebSocket: No token found, skipping connection.");
            return;
        }

        // Deactivate existing connection if any
        if (clientRef.current) {
            console.log("WebSocket: Deactivating existing client...");
            clientRef.current.deactivate();
        }

        let API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";
        // Ensure no trailing slash for SockJS
        if (API_URL.endsWith('/')) API_URL = API_URL.slice(0, -1);
        
        console.log(`WebSocket: Attempting connection to ${API_URL}/ws`);
        const socket = new SockJS(`${API_URL}/ws`);
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: (frame) => {
                console.log('WebSocket: Connected successfully!', frame);
                setConnected(true);
            },
            onStompError: (frame) => {
                console.error('WebSocket: Broker error', frame.headers['message']);
                setConnected(false);
            },
            onWebSocketClose: () => {
                console.log('WebSocket: Connection closed');
                setConnected(false);
            },
            onDisconnect: () => {
                console.log('WebSocket: Disconnected');
                setConnected(false);
            }
        });

        client.activate();
        clientRef.current = client;
        setStompClient(client);
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            connect();
        }
        return () => {
            if (clientRef.current) {
                console.log("WebSocket: Cleaning up on unmount...");
                clientRef.current.deactivate();
            }
        };
    }, [connect]);

    const subscribe = (destination, callback) => {
        if (!stompClient || !connected) return null;
        return stompClient.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });
    };

    const sendMessage = (destination, body) => {
        if (!stompClient || !connected) return;
        stompClient.publish({
            destination,
            body: JSON.stringify(body)
        });
    };

    return (
        <WebSocketContext.Provider value={{ connected, subscribe, sendMessage, notifications, setNotifications }}>
            {children}
        </WebSocketContext.Provider>
    );
};
