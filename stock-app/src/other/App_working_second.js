// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
          'username': username,
          'password': password
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        localStorage.setItem('token', response.data.access_token);
        onLogin();
      } else {
        // Registration
        await axios.post(`${API_URL}/register`, { username, password });
        setError('Registration successful. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.detail || 'An error occurred. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Tabs value={isLogin ? 0 : 1} onChange={(e, newValue) => setIsLogin(newValue === 0)} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isLogin ? 'Sign In' : 'Register'}
        </Button>
        {error && <Typography color="error" align="center">{error}</Typography>}
      </Box>
    </Box>
  );
};

export default Login;