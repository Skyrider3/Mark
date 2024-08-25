import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { createChart, ColorType } from 'lightweight-charts';
import { Card, CardContent, Typography, Box, Button, FormControl, CircularProgress, Alert, TextField, Select, MenuItem, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useAppContext } from '../../context/AppContext';

const API_URL = 'http://localhost:8000';

const StockChart = () => {
  const [stockData, setStockData] = useState([]);
  const [dateRange, setDateRange] = useState('1M');
  const [symbol, setSymbol] = useState('TSLA');
  const { error, setError, loading, setLoading } = useAppContext();
  const chartContainerRef = React.useRef();
  const [debugInfo, setDebugInfo] = useState('');
  const [selectedOption, setSelectedOption] = useState('highVolume');

  const highVolumeStocks = [
    { name: 'AAPL', ask: 150.25, bid: 150.20, volume: 1000000 },
    { name: 'GOOGL', ask: 2800.50, bid: 2800.25, volume: 500000 },
    { name: 'MSFT', ask: 300.75, bid: 300.70, volume: 750000 },
    { name: 'AMZN', ask: 3400.00, bid: 3399.50, volume: 300000 },
    { name: 'FB', ask: 330.25, bid: 330.00, volume: 600000 },
  ];

  const stockOptions = {
    highVolume: { title: 'High Volume Stocks', data: highVolumeStocks },
    topTech: { title: 'Top Tech Stocks', data: highVolumeStocks },
    topTrending: { title: 'Top Trending Stocks', data: highVolumeStocks },
    bestBuy: { title: 'Best Buy Stocks', data: highVolumeStocks },
  };

  const fetchStockData = useCallback(async (range, stockSymbol) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/stock_data?symbol=${stockSymbol}&range=${range}`);
      setStockData(response.data);
      setDebugInfo(`Fetched ${response.data.length} data points`);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Failed to fetch stock data. Please try again later.');
      setDebugInfo(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  useEffect(() => {
    fetchStockData(dateRange, symbol);
  }, [dateRange, symbol, fetchStockData]);

  useEffect(() => {
    if (stockData.length === 0 || !chartContainerRef.current) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'black',
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.5)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.5)',
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', 
      downColor: '#ef5350', 
      borderVisible: false,
      wickUpColor: '#26a69a', 
      wickDownColor: '#ef5350'
    });

    const sma20Series = chart.addLineSeries({ color: 'blue', lineWidth: 2 });
    const sma50Series = chart.addLineSeries({ color: 'red', lineWidth: 2 });

    candlestickSeries.setData(
      stockData.map(d => ({
        time: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close
      }))
    );

    sma20Series.setData(
      stockData.map(d => ({
        time: d.date,
        value: d.sma_20
      })).filter(d => d.value !== null)
    );

    sma50Series.setData(
      stockData.map(d => ({
        time: d.date,
        value: d.sma_50
      })).filter(d => d.value !== null)
    );

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [stockData]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Stock Data Visualization</Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <TextField
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol"
                size="small"
                sx={{ mr: 2, width: 120 }}
              />
              <Select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                size="small"
                sx={{ mr: 2, width: 80 }}
              >
                <MenuItem value="1W">1W</MenuItem>
                <MenuItem value="1M">1M</MenuItem>
                <MenuItem value="3M">3M</MenuItem>
                <MenuItem value="1Y">1Y</MenuItem>
              </Select>
              <Button variant="contained" onClick={() => fetchStockData(dateRange, symbol)}>
                Fetch Data
              </Button>
            </Box>
            <Box sx={{ height: 400, position: 'relative' }} ref={chartContainerRef}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', position: 'absolute', width: '100%', backgroundColor: 'rgba(255,255,255,0.8)' }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Typography variant="body2" sx={{ mt: 2, whiteSpace: 'pre-line', color: 'text.secondary' }}>
              {debugInfo}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%' }}>
        <FormControl fullWidth>
          <Select
            value={selectedOption}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="highVolume">High Volume Stocks</MenuItem>
            <MenuItem value="topTech">Top Tech Stocks</MenuItem>
            <MenuItem value="topTrending">Top Trending Stocks</MenuItem>
            <MenuItem value="bestBuy">Best Buy Stocks</MenuItem>
          </Select>
        </FormControl>
          <CardContent>
            <Typography variant="h6" gutterBottom>{stockOptions[selectedOption].title}</Typography>
            <List>
              {stockOptions[selectedOption].data.map((stock, index) => (
                <ListItem key={index} divider={index < highVolumeStocks.length - 1}>
                  <ListItemText
                    primary={stock.name}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          Ask: ${stock.ask.toFixed(2)} | Bid: ${stock.bid.toFixed(2)}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Volume: {stock.volume.toLocaleString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StockChart;