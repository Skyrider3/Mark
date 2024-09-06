import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import landing from "../../image/landing.jpg";
import { styled } from "@mui/system";
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../appconfig";

const BackgroundImage = styled("div")(({ theme }) => ({
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Adjust this value to control darkness
    zIndex: -1,
  },
  backgroundImage: `url(${landing})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: -2, // Changed to -2 so it's behind the overlay
}));

const GlassCard = styled(Card)({
  background: "rgba(0, 0, 0, 0.6)",
  backdropFilter: "blur(5px)",
  borderRadius: "10px",
  padding: "20px",
  color: "grey",
});

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        navigate("/dashboard");
        // const response = await axios.post(
        //   `${API_URL}/token`,
        //   new URLSearchParams({
        //     username: username,
        //     password: password,
        //   }),
        //   {
        //     headers: {
        //       "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //   }
        // );
        // localStorage.setItem("token", response.data.access_token);
        // onLogin({ username });
      } else {
        await axios.post(`${API_URL}/register`, { username, password });
        setError("Registration successful. Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      setError(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackgroundImage />
      <GlassCard>
        <CardContent>
          <Paper
            elevation={3}
            sx={{ maxWidth: 400, margin: "auto", mt: 4, p: 3 }}
          >
            <Typography variant="h5" component="h1" gutterBottom align="center">
              {isLogin ? "Sign In" : "Register"}
            </Typography>
            <Tabs
              value={isLogin ? 0 : 1}
              onChange={(e, newValue) => setIsLogin(newValue === 0)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
            <Box component="form" onSubmit={handleSubmit} noValidate>
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
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Register"}
              </Button>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Paper>
        </CardContent>
      </GlassCard>
    </>
  );
};

export default Login;
