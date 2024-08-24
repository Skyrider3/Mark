import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import Login from "../Authentication/Login";
import StockChart from "./StockChart";
import AnalysisForm from "./AnalysisForm";
import ChatHistory from "./ChatHistory";
import DataScienceQueryExecutor from "./DataScienceQueryExecutor";
import NavBar from "../NavBar";

const AnalysisHome = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [selectedStock, setSelectedStock] = useState('AAPL');
    const [chatHistory, setChatHistory] = useState([]);

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setCurrentUser(user);
      };


    const handleStockSelect = (stock) => {
        setSelectedStock(stock);
      };
    
      const handleNewChatMessage = (message) => {
        setChatHistory(prevHistory => [...prevHistory, message]);
      };

  return (
    <>
    <NavBar/>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Paper
              elevation={3}
              sx={{ p: 2, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom>
                Stock Chart
              </Typography>
              <StockChart stock={selectedStock} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ p: 2, display: "flex", flexDirection: "column" }}
            >
              <AnalysisForm
                onStockSelect={handleStockSelect}
                onAnalysisRequest={handleNewChatMessage}
              />
            </Paper>
          </Grid>
          {/* <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <StockComparison />
                </Paper>
                </Grid> */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 400,
              }}
            >
              <ChatHistory
                history={chatHistory}
                onNewMessage={handleNewChatMessage}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
              }}
            >
              <DataScienceQueryExecutor />
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
    </>
  );
};

export default AnalysisHome;
