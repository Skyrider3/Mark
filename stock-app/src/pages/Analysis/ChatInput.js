// src/components/ChatInput.js
import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const { addChatMessage, setError } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/analyze`, { request: input });
      addChatMessage({ user: input, bot: response.data.result });
      setInput('');
    } catch (error) {
      console.error('Error sending chat message:', error);
      setError('An error occurred while processing your chat message.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message here..."
        sx={{ mr: 1 }}
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
        Send
      </Button>
    </Box>
  );
};

export default ChatInput;