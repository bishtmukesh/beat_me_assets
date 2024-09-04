import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const SocketTest = () => {

    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');

        useEffect(() => {
            const socket = new SockJS('http://localhost:8080/room');
            const client = Stomp.over(socket);
            setStompClient(client);

            client.connect({}, frame => {
                setConnected(true);
                console.log('Connected: ' + frame);
    
                client.subscribe('/room', messageOutput => {
                    const message = JSON.parse(messageOutput.body);
                    setMessages(prevMessages => [...prevMessages, message]);
                });
            });

            return () => {
                if (client !== null) {
                    client.disconnect();
                }
                setConnected(false);
                console.log("Disconnected");
            };
        }, []);

    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            stompClient.send("/message/chat", {}, JSON.stringify({ from: nickname, text: message }));
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Choose a nickname"
                />
            </div>
            <br />
            <div>
                <button disabled={connected} onClick={() => stompClient.connect({}, () => setConnected(true))}>
                    Connect
                </button>
                <button disabled={!connected} onClick={() => { stompClient.disconnect(); setConnected(false); }}>
                    Disconnect
                </button>
            </div>
            <br />
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        {msg.from}: {msg.text} ({msg.time})
                    </p>
                ))}
            </div>
        </div>
    );
};

export default SocketTest;