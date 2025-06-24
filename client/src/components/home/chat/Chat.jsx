import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './chat.module.css';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL);

export default function Chat({ senderPhone, receiverPhone }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // Redirect if sender not logged in
    useEffect(() => {
        if (!senderPhone || senderPhone.length !== 10) {
            navigate('/sign-in');
        }
    }, [senderPhone, navigate]);

    // Fetch previous messages
    useEffect(() => {
        async function getChat() {
            try {
                const url = import.meta.env.VITE_API_BASE_URL + `/get-user-chat`;
                const res = await axios.get(url, {
                    params: { senderPhone, receiverPhone }
                });
                console.table(res?.data?.chats)
                setMessages(res?.data?.chats || []); // assuming array of messages
            } catch (error) {
                console.error("Failed to fetch chat:", error);
            }
        }

        if (receiverPhone?.length === 10 && senderPhone?.length === 10) {
            getChat();
        }
    }, [receiverPhone, senderPhone]);

    // Listen for incoming socket messages
    useEffect(() => {
        socket.on('receive-msg', (msgObj) => {
            setMessages(prev => [...prev, msgObj]);
        });

        return () => socket.off('receive-msg');
    }, []);

    useEffect(() => {
        if (senderPhone.length == 10) {
            socket.emit('join', senderPhone);
        }
    }, [senderPhone])

    // Send message
    function sendMessage() {
        if (newMessage.trim().length === 0) return;

        const msgObj = {
            sender: senderPhone,
            receiver: receiverPhone,
            message: newMessage.trim(),
            timestamp: new Date().toISOString()
        };

        socket.emit('send-msg', msgObj);
        setMessages(prev => [...prev, msgObj]);
        setNewMessage("");
    }

    if (!receiverPhone) {
        return (
            <section style={{ width: '80%', height: '100%', display: 'grid', placeItems: 'center' }}>
                <h2 style={{ color: 'rgba(255,255,255,.7)' }}>MyChat</h2>
            </section>
        );
    }

    return (
        <section style={{ width: '80%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className={styles.top}>
                <h3 style={{ color: 'white' }}>Chat with {receiverPhone}</h3>
            </div>

            <div className={styles.messages}>
                {messages.map((m, i) => (
                    <div style={{ width: '100%' }} key={i}>
                        <div className={m.sender === senderPhone ? styles.sent : styles.received}>
                            <p>{m.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.inputBox}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </section>
    );
}
