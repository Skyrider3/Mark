import React, { useState, useEffect } from "react";
import {
  Typography,
  Toolbar,
  AppBar,
  Button,
} from "@mui/material";

const NavBar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
          setCurrentUser({ username: 'User' });
        }
      }, []);
    
      const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCurrentUser(null);
      };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Profit Trader
        </Typography>
        {isAuthenticated && (
          <>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Welcome, {currentUser?.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
