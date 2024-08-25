import React, { useState } from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";
import Login from "../Authentication/Login";
import StockChart from "./StockChart";
import AnalysisForm from "./AnalysisForm";
import StockComparison from "./StockComparison";
import ChatHistory from "./ChatHistory";
import DataScienceQueryExecutor from "./DataScienceQueryExecutor";
import NavBar from "../NavBar";
import NavbarV2 from "../NavBarV2";

const AnalysisHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [chatHistory, setChatHistory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { key: "chatStock", label: "Chat with Stock" },
    { key: "compareStock", label: "Compare Stock" },
    { key: "interactiveAi", label: "Interactive AI Analysis" },
    { key: "chatAnalyist", label: "Chat with Analyst Expert" },
  ];

  const handleCategoryClick = (category) => {
    setActiveCategory(category === activeCategory ? null : category);
  };

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleNewChatMessage = (message) => {
    setChatHistory((prevHistory) => [...prevHistory, message]);
  };

  const StockCompare = () => {
    return (
      <Grid item xs={12}>
        <Paper
          elevation={3}
          sx={{ p: 2, display: "flex", flexDirection: "column" }}
        >
          <StockComparison />
        </Paper>
      </Grid>
    );
  };

  const StockChat = () => {
    return (
      <Grid item xs={12} md={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ 
                p: 2, 
                display: "flex", 
                flexDirection: "column",
                height: '100%' // This ensures both papers have the same height
              }}
            >
              <AnalysisForm
                onStockSelect={handleStockSelect}
                onAnalysisRequest={handleNewChatMessage}
              />
            </Paper>
          </Grid>
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
        </Grid>
      </Grid>
    );
  };

  const ExpertChat = () => {
    return (
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
    );
  };

  const InteractiveAI = () => {
    return (<Grid item xs={12} md={12}>
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
    </Grid>);
  }

  const renderActiveComponent = () => {
    switch(activeCategory) {
      case 'chatStock':
        return <StockChat />;
      case 'compareStock':
        return <StockCompare />;
      case 'interactiveAi':
        return <InteractiveAI />;
      case 'chatAnalyist':
        return <ExpertChat />;
      default:
        return null;
    }
  };

  return (
    <>
      <NavbarV2 />
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

            <Grid item xs={12}>
              <Grid container spacing={2} justifyContent="center">
                {categories.map((category) => (
                  <Grid item key={category.key}>
                    <Button
                      variant={
                        activeCategory === category.key
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleCategoryClick(category.key)}
                    >
                      {category.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {activeCategory && (
              <Grid item xs={12}>
                {renderActiveComponent()}
             </Grid>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default AnalysisHome;
