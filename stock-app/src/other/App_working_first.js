import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardActions, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { API_URL } from "../appconfig";

const TeslaStockApp = () => {
  const [stockData, setStockData] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/stock_data`)
      .then(response => setStockData(response.data))
      .catch(error => console.error('Error fetching stock data:', error));
  }, []);

  const handleChatSubmit = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/chat`, {
        params: { message: chatInput }
      });
      setChatHistory([...chatHistory, { user: chatInput, bot: response.data }]);
      setChatInput('');
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Tesla Stock Data
          </Typography>
          <div style={{ height: '400px', marginBottom: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stockData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ height: '200px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            {chatHistory.map((chat, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>You: {chat.user}</Typography>
                <Typography variant="body1">Bot: {chat.bot}</Typography>
              </div>
            ))}
          </div>
        </CardContent>
        <CardActions>
          <TextField
            fullWidth
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask about Tesla stock data..."
            variant="outlined"
            size="small"
            style={{ marginRight: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={handleChatSubmit}>
            Send
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default TeslaStockApp;