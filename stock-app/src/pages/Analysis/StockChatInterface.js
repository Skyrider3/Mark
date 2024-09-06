import React, { useState } from 'react';
import { axiosPost } from "../Axios/axiosMethods";

const StockChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await axiosPost('/api/stock-chat', { query: input });
      const botMessage = { text: response.data.reply, sender: 'bot' };
      setMessages(messages => [...messages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about stock data..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default StockChatInterface;