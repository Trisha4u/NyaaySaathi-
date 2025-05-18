import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function NyaySaathiChat() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! Ask me about your legal rights...' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    try {
      const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        sender: 'user1',
        message: userMessage,
      });

      const botReplies = response.data.map(entry => entry.text).filter(Boolean);

      if (botReplies.length === 0) {
        setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I didn't understand that." }]);
      } else {
        botReplies.forEach(reply => {
          setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        });
      }
    } catch (error) {
      console.error('Error communicating with Rasa:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to NyaySaathi server.' }]);
    }
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: '30px auto',
      padding: 20,
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      borderRadius: 12,
      backgroundColor: '#ffffff',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>
        Rights Assistant 🤖⚖️
      </h1>

      <div style={{
        border: '1px solid #ccc',
        borderRadius: 12,
        padding: 15,
        minHeight: 350,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        overflowY: 'auto',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              maxWidth: '75%',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#d0f0fd' : '#e0e0e0',
              color: '#222',
              padding: '10px 15px',
              borderRadius: 20,
              fontWeight: msg.sender === 'bot' ? '600' : '400',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <strong>{msg.sender === 'bot' ? 'NyaySaathi' : 'You'}: </strong>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Type your legal question here..."
          style={{
            flexGrow: 1,
            padding: '12px 15px',
            borderRadius: 25,
            border: '1.5px solid #ccc',
            fontSize: 16,
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '12px 25px',
            borderRadius: 25,
            border: 'none',
            backgroundColor: '#3498db',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
