import React, { useState, useEffect } from "react";
import {
  Container, Paper,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  CircularProgress,
  Alert,
  TextField,
  Select,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Login from "../Authentication/Login";
import StockChart from "./StockChart";
import AnalysisForm from "./AnalysisForm";
import StockComparison from "./StockComparison";
import ChatHistory from "./ChatHistory";
import DataScienceQueryExecutor from "./DataScienceQueryExecutor";
import NavBar from "../NavBar";
import { API_URL } from "../appconfig";
import { axiosGet, axiosPost } from "../Axios/axiosMethods";

const AnalysisHome = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [selectedStock, setSelectedStock] = useState("TSLA");
  const [stockChatHistory, setStockChatHistory] = useState([]);
  const [expertChatHistory, setExpertChatHistory] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedOption, setSelectedOption] = useState("highVolume");

  const highVolumeStocks = [
    { name: "AAPL", ask: 150.25, bid: 150.2, volume: 1000000 },
    { name: "GOOGL", ask: 2800.5, bid: 2800.25, volume: 500000 },
    { name: "MSFT", ask: 300.75, bid: 300.7, volume: 750000 },
    { name: "AMZN", ask: 3400.0, bid: 3399.5, volume: 300000 },
    { name: "FB", ask: 330.25, bid: 330.0, volume: 600000 },
  ];

  const stockOptions = {
    highVolume: { title: "High Volume Stocks", data: highVolumeStocks },
    topTech: { title: "Top Tech Stocks", data: highVolumeStocks },
    topTrending: { title: "Top Trending Stocks", data: highVolumeStocks },
    bestBuy: { title: "Best Buy Stocks", data: highVolumeStocks },
  };

  const categories = [
    { key: "chatStock", label: "Chat with Stock" },
    { key: "compareStock", label: "Compare Stock" },
    { key: "interactiveAi", label: "Interactive AI Analysis" },
    { key: "chatAnalyist", label: "Chat with Analyst Expert" },
    { key: "AIAnalysis", label: "AI Comprehensive Analysis" },
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

  const handleNewStockChatMessage = (message) => {
    setStockChatHistory((prevHistory) => [...prevHistory, message]);
  };

  const handleNewExpertChatMessage = (message) => {
    setExpertChatHistory((prevHistory) => [...prevHistory, message]);
  };

  const TrendingStocks = () =>{
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
    };
    return (        <Card sx={{ height: "100%" }}>
      <FormControl fullWidth>
        <Select
          value={selectedOption}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="highVolume">High Volume Stocks</MenuItem>
          <MenuItem value="topTech">Top Tech Stocks</MenuItem>
          <MenuItem value="topTrending">Top Trending Stocks</MenuItem>
          <MenuItem value="bestBuy">Best Buy Stocks</MenuItem>
        </Select>
      </FormControl>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {stockOptions[selectedOption].title}
        </Typography>
        <List>
          {stockOptions[selectedOption].data.map((stock, index) => (
            <ListItem
              key={index}
              divider={index < highVolumeStocks.length - 1}
            >
              <ListItemText
                primary={stock.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Ask: ${stock.ask.toFixed(2)} | Bid: $
                      {stock.bid.toFixed(2)}
                    </Typography>
                    <br />
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      Volume: {stock.volume.toLocaleString()}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>);
  }

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
    const stockMenuItems = [
      { key: "general", label: "General" },
      { key: "technical", label: "Technical" },
      { key: "sentiment", label: "Sentiment" },
    ];
    let menu = { menuName: "Analysis Type", menuItems: stockMenuItems };

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
                height: "100%", // This ensures both papers have the same height
              }}
            >
              <AnalysisForm
                selectedStock={selectedStock}
                apiEndpoint={"analyze"}
                componentName={"Chart With Stock"}
                onStockSelect={handleStockSelect}
                onAnalysisRequest={handleNewExpertChatMessage}
                menu={menu}
                exampleQuery={"Give me current trend from the stock?"}
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
                history={stockChatHistory}
                onNewMessage={handleNewStockChatMessage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const ExpertChat = () => {
    const [expertMenu, setExpertMenu] = useState({
      menuName: "Expert",
      menuItems: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const getExpertMenuItems = async () => {
        try {
          setLoading(true);
          const response = await axiosGet(`${API_URL}/api/financialgurus`);
          if (response.data) {
            const expertMenuItems = response.data.gurus.map((expertItem) => ({
              key: expertItem.name,
              label: `${expertItem.name} (${expertItem.expertise})`,
            }));
            setExpertMenu({ menuName: "Expert", menuItems: expertMenuItems });
          }
        } catch (e) {
          console.error("Error fetching expert names", e);
          setError("Failed to load expert list");
        } finally {
          setLoading(false);
        }
      };

      getExpertMenuItems();
    }, []);

    if (loading) return <div>Loading experts...</div>;
    if (error) return <div>Error: {error}</div>;

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
                height: "100%", // This ensures both papers have the same height
              }}
            >
              <AnalysisForm
                selectedStock={selectedStock}
                componentName={"Chart With Analyst Expert"}
                apiEndpoint={"AIAdvisor"}
                onStockSelect={handleStockSelect}
                onAnalysisRequest={handleNewExpertChatMessage}
                menu={expertMenu}
                exampleQuery={"Give me your analysis on Stock?"}
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
                history={expertChatHistory}
                onNewMessage={handleNewExpertChatMessage}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const InteractiveAI = () => {
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
          <DataScienceQueryExecutor selectedStock={selectedStock}/>
        </Paper>
      </Grid>
    );
  };

  const ComprehensieAnalysis = () => {
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const getComprehensiveData = async () => {
        try {
          setLoading(true);
          const formData = new FormData();
          formData.append("stock", selectedStock);
          const response = await axiosPost(
            `${API_URL}/api/AIAnalysis`,
            formData
          );
          if (response.data) {
            setData(response.data);
          }
        } catch (e) {
          console.error("Error fetching comprehensive data", e);
          setError("Failed to load comprehensive data");
        } finally {
          setLoading(false);
        }
      };
      getComprehensiveData();
    }, []);

    if (loading) return <div>Loading data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <Grid item xs={12} className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">{key}</h2>
            <p className="text-gray-700">{value}</p>
          </div>
        ))}
      </Grid>
    );
  };

  const renderActiveComponent = () => {
    switch (activeCategory) {
      case "chatStock":
        return <StockChat />;
      case "compareStock":
        return <StockCompare />;
      case "interactiveAi":
        return <InteractiveAI />;
      case "chatAnalyist":
        return <ExpertChat />;
      case "AIAnalysis":
        return <ComprehensieAnalysis />;
      default:
        return null;
    }
  };

  return (
    <>
      <NavBar />
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
                <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                <StockChart selectedStock={selectedStock} onStockChange={handleStockSelect}/>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TrendingStocks/>
                  </Grid>
                  </Grid>
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
