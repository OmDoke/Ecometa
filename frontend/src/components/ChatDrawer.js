import React, { useState, useEffect, useRef } from 'react';
import { Offcanvas, Form, Button, InputGroup, Spinner } from 'react-bootstrap';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import { IoSend } from 'react-icons/io5';

const ChatDrawer = ({ show, onHide, ewasteItem, currentUser }) => {
    const { subscribe, sendMessage, connected } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    // Fetch History via REST
    useEffect(() => {
        if (show && ewasteItem?.id) {
            setLoading(true);
            const token = localStorage.getItem('token');
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
            axios.get(`${baseUrl}/ewaste/chat/${ewasteItem.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setMessages(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch history:", err);
                setLoading(false);
            });
        }
    }, [show, ewasteItem?.id]);

    // Subscribing to Live Messages
    useEffect(() => {
        if (connected && ewasteItem?.id) {
            const subscription = subscribe(`/topic/ewaste/${ewasteItem.id}`, (msg) => {
                setMessages(prev => {
                    // Avoid duplicate if we sent it and it came back via broker
                    if (prev.find(m => m.id === msg.id)) return prev;
                    return [...prev, msg];
                });
            });
            return () => subscription?.unsubscribe();
        }
    }, [connected, ewasteItem?.id, subscribe]);

    // Auto-scroll
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !connected) return;

        const receiverId = currentUser?.role === 'USER' ? ewasteItem?.recycler?.id : ewasteItem?.user?.id;
        
        const chatMsg = {
            ewasteItemId: ewasteItem?.id,
            senderId: currentUser?.id,
            receiverId: receiverId,
            content: newMessage,
            timestamp: new Date().toISOString()
        };

        sendMessage('/app/chat.send', chatMsg);
        setNewMessage('');
    };

    if (!ewasteItem) return null;

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className="bg-dark text-white" style={{ width: '400px' }}>
            <Offcanvas.Header closeButton closeVariant="white">
                <Offcanvas.Title>
                    Connection: {ewasteItem?.type}
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                        Chatting with {currentUser?.role === 'USER' ? ewasteItem?.recycler?.name : ewasteItem?.user?.name}
                    </div>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column p-0">
                <div className="flex-grow-1 p-3 overflow-auto chat-container" style={{ maxHeight: 'calc(100vh - 150px)' }}>
                    {loading ? (
                        <div className="text-center mt-5"><Spinner animation="border" variant="info" /></div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-muted mt-5">No messages yet. Send a greeting!</div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`mb-3 d-flex ${msg.senderId === currentUser?.id ? 'justify-content-end' : 'justify-content-start'}`}>
                                <div className={`p-2 rounded-3 shadow-sm ${msg.senderId === currentUser?.id ? 'bg-primary' : 'bg-secondary'}`} style={{ maxWidth: '80%' }}>
                                    <div>{msg.content}</div>
                                    <div style={{ fontSize: '0.65rem', opacity: 0.7, textAlign: 'right' }}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={scrollRef} />
                </div>
                
                <div className="p-3 bg-dark border-top border-secondary">
                    <Form onSubmit={handleSend}>
                        <InputGroup>
                            <Form.Control
                                className="bg-dark text-white border-secondary"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                disabled={!connected}
                            />
                            <Button variant="info" type="submit" disabled={!connected}>
                                <IoSend />
                            </Button>
                        </InputGroup>
                        {!connected && <div className="text-danger small mt-1">Reconnecting to server...</div>}
                    </Form>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default ChatDrawer;
