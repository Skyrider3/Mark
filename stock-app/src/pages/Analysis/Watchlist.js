// src/components/Watchlist.js
import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { API_URL } from "../appconfig";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await axios.get(`${API_URL}/watchlist`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWatchlist(response.data);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const addToWatchlist = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/watchlist/add`, { symbol: newSymbol }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewSymbol('');
      fetchWatchlist();
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Your Watchlist</Typography>
      <List>
        {watchlist.map((symbol, index) => (
          <ListItem key={index}>
            <ListItemText primary={symbol} />
          </ListItem>
        ))}
      </List>
      <Box component="form" onSubmit={addToWatchlist} sx={{ mt: 2 }}>
        <TextField
          size="small"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
          placeholder="Add symbol"
        />
        <Button type="submit" variant="contained" sx={{ ml: 1 }}>Add</Button>
      </Box>
    </Box>
  );
};

export default Watchlist;