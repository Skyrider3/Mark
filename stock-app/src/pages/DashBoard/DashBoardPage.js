import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import NavBar from "../NavBar";

const DashboardPage = () => {
  // Static data for demonstration
  const chartData = [
    { name: "Jan", value: 6000 },
    { name: "Feb", value: 6200 },
    { name: "Mar", value: 6100 },
    { name: "Apr", value: 6500 },
    { name: "May", value: 6683.61 },
  ];

  const cryptoData = [
    { name: "BTC", value: 64058.54, change: -0.1 },
    { name: "ETH", value: 2750.42, change: -0.56 },
    { name: "LTC", value: 64.62, change: -2.17 },
  ];

  const stockData = [
    { name: "AAPL", value: 227.1, change: 0.11 },
    { name: "AMZN", value: 177.26, change: 0.12 },
    { name: "MSFT", value: 417.15, change: 0.09 },
    // { name: "TSLA", value: 417.15, change: 0.09 },
  ];

  return (
    <>
      <NavBar />
      <Container
        maxWidth="lg"
        style={{ backgroundColor: "white", padding: "20px" }}
      >
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h4">Investing</Typography>
              <Typography variant="h3">$6,683.61</Typography>
              <Typography variant="subtitle1" color="error">
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
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h6">WatchList</Typography>
              {stockData.map((crypto) => (
                <div key={crypto.name}>
                  <Typography>
                    {crypto.name}: ${crypto.value}
                  </Typography>
                  <Typography
                    color={crypto.change > 0 ? "success.main" : "error.main"}
                  >
                    {crypto.change > 0 ? "+" : ""}
                    {crypto.change}%
                  </Typography>
                </div>
              ))}
            </Paper>
            <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
              <Typography variant="h6">Purchased Stocks</Typography>
              {stockData.map((stock) => (
                <div key={stock.name}>
                  <Typography>
                    {stock.name}: ${stock.value}
                  </Typography>
                  <Typography
                    color={stock.change > 0 ? "success.main" : "error.main"}
                  >
                    {stock.change > 0 ? "+" : ""}
                    {stock.change}%
                  </Typography>
                </div>
              ))}
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          <Grid item xs={12} md={8}>
          <Typography variant="subtitle1">Link to your robinhood account to get trading data and trade stocks</Typography>
            <Button variant="contained" component="label">
            Link to your robinhood account
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default DashboardPage;
