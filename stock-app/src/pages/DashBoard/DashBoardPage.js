import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from 'react-router-dom';
import NavBar from "../NavBar";

const DashboardPage = () => {
  const navigate = useNavigate();

  // Static data for demonstration
  const chartData = [
    { name: "Jan", value: 6000 },
    { name: "Feb", value: 6200 },
    { name: "Mar", value: 6100 },
    { name: "Apr", value: 6500 },
    { name: "May", value: 6683.61 },
  ];

  const cryptoData = [
    { name: "BTC-USD", value: 64058.54, change: -0.1 },
    { name: "ETH-USD", value: 2750.42, change: -0.56 },
    { name: "LTC-USD", value: 64.62, change: -2.17 },
  ];

  const stockData = [
    { name: "AAPL", value: 227.1, change: 0.11 },
    { name: "AMZN", value: 177.26, change: 0.12 },
    { name: "MSFT", value: 417.15, change: 0.09 },
  ];

  const StockItem = ({ item }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-100 transition-colors duration-300 ease-in-out cursor-pointer"
    onClick={(e)=>{navigate(`/stock/${item.name}`)}}>
      <Typography variant="body1" className="font-bold">{item.name}</Typography>
      <div className="text-right">
        <Typography variant="body1">${item.value.toFixed(2)}</Typography>
        <Typography 
          variant="body2" 
          className={item.change >= 0 ? "text-green-500" : "text-red-500"}
        >
          {item.change >= 0 ? "+" : ""}{item.change}%
        </Typography>
      </div>
    </div>
  );

  return (
    <>
    <NavBar/>
    <Container maxWidth="lg" className="bg-white p-5">
      <Grid container spacing={3} className="mt-5">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} className="p-5">
            <Typography variant="h4">Investing</Typography>
            <Typography variant="h3">$6,683.61</Typography>
            <Typography variant="subtitle1" className="text-red-500">
              -$0.98 (-0.01%) Today
            </Typography>
            <LineChart width={600} height={300} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#ff7300" />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="p-5 mb-5">
            <Typography variant="h6" className="mb-3">WatchList</Typography>
            {cryptoData.map((item) => (
              <StockItem key={item.name} item={item} />
            ))}
          </Paper>
          <Paper elevation={3} className="p-5">
            <Typography variant="h6" className="mb-3">Purchased Stocks</Typography>
            {stockData.map((item) => (
              <StockItem key={item.name} item={item} />
            ))}
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={3} className="mt-5">
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1">Link to your robinhood account to get trading data and trade stocks</Typography>
          <Button 
            variant="contained" 
            component="label" 
            className="mt-2 transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1"
          >
            Link to your robinhood account
          </Button>
        </Grid>
      </Grid>
    </Container>
    </>
  );
};

export default DashboardPage;