import React, { useState, useEffect, useCallback } from "react";
import { createChart, ColorType } from "lightweight-charts";
import {
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
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAppContext } from "../../context/AppContext";
import { API_URL } from "../appconfig";
import { axiosGet } from "../Axios/axiosMethods";

const StockChart = ({ selectedStock, onStockChange }) => {
  const [stockData, setStockData] = useState([]);
  const [dateRange, setDateRange] = useState("1M");
  const [symbol, setSymbol] = useState(selectedStock);
  const { error, setError, loading, setLoading } = useAppContext();
  const chartContainerRef = React.useRef();
  const [debugInfo, setDebugInfo] = useState("");

  const [orderType, setOrderType] = useState("market");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderAction, setOrderAction] = useState("");
  const [orderDetails, setOrderDetails] = useState({
    quantity: "",
    price: "",
    stopPrice: "",
  });
  const [orderStatus, setOrderStatus] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchStockData = useCallback(
    async (range, stockSymbol) => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosGet(
          `${API_URL}/api/stock_data?symbol=${stockSymbol}&range=${range}`
        );
        setStockData(response.data);
        setDebugInfo(`Fetched ${response.data.length} data points`);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError("Failed to fetch stock data. Please try again later.");
        setDebugInfo(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  useEffect(() => {
    if (symbol && dateRange) {
      fetchStockData(dateRange, symbol);
    }
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
        background: { type: ColorType.Solid, color: "white" },
        textColor: "black",
      },
      grid: {
        vertLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
        horzLines: {
          color: "rgba(197, 203, 206, 0.5)",
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const sma20Series = chart.addLineSeries({ color: "blue", lineWidth: 2 });
    const sma50Series = chart.addLineSeries({ color: "red", lineWidth: 2 });

    candlestickSeries.setData(
      stockData.map((d) => ({
        time: d.date,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
    );

    sma20Series.setData(
      stockData
        .map((d) => ({
          time: d.date,
          value: d.sma_20,
        }))
        .filter((d) => d.value !== null)
    );

    sma50Series.setData(
      stockData
        .map((d) => ({
          time: d.date,
          value: d.sma_50,
        }))
        .filter((d) => d.value !== null)
    );

    chart.timeScale().fitContent();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [stockData]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleQuantitySelect = (event, newQuantity) => {
    setSelectedQuantity(newQuantity);
    setOrderDetails({ ...orderDetails, quantity: newQuantity ? newQuantity.toString() : "" });
  };

  const handleBuySell = (action) => {
    setOrderAction(action);
    setShowOrderForm(true);
  };

  const handleOrderTypeChange = (event) => {
    setOrderType(event.target.value);
  };

  const handleOrderDetailsChange = (event) => {
    setOrderDetails({
      ...orderDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmitOrder = () => {
    setTimeout(() => {
      setOrderStatus(Math.random() > 0.5 ? "success" : "failure");
      setTimeout(() => {
        setShowOrderForm(false);
        setOrderStatus(null);
        setOrderDetails({ quantity: "", price: "", stopPrice: "" });
        setSelectedQuantity(null);
      }, 2000);
    }, 1000);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically also update this in your backend or local storage
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Stock Data Chart
          </Typography>
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton onClick={toggleFavorite} color="primary">
              {isFavorite ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <TextField
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value.toUpperCase());
              onStockChange(e.target.value.toUpperCase());
            }}
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
          <Button
            variant="contained"
            onClick={() => fetchStockData(dateRange, symbol)}
          >
            Fetch Data
          </Button>
        </Box>
        <Box
          sx={{ height: 400, position: "relative" }}
          ref={chartContainerRef}
        >
          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                position: "absolute",
                width: "100%",
                backgroundColor: "rgba(255,255,255,0.8)",
              }}
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Typography
          variant="body2"
          sx={{ mt: 2, whiteSpace: "pre-line", color: "text.secondary" }}
        >
          {debugInfo}
        </Typography>
        
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <ToggleButtonGroup
            value={selectedQuantity}
            exclusive
            onChange={handleQuantitySelect}
            aria-label="quantity selection"
          >
            {[1, 2, 4, 6, 10].map((quantity) => (
              <ToggleButton
                key={quantity}
                value={quantity}
                aria-label={`quantity ${quantity}`}
                sx={{
                  borderRadius: '50%',
                  minWidth: 40,
                  width: 40,
                  height: 40,
                  mr: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                {quantity}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleBuySell("buy")}
              sx={{ mr: 1 }}
            >
              Buy
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleBuySell("sell")}
            >
              Sell
            </Button>
          </Box>
        </Box>

        <Dialog open={showOrderForm} onClose={() => setShowOrderForm(false)}>
          <DialogTitle>{`${orderAction.toUpperCase()} ${symbol}`}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Select
                value={orderType}
                onChange={handleOrderTypeChange}
                displayEmpty
              >
                <MenuItem value="market">Market Order</MenuItem>
                <MenuItem value="limit">Limit Order</MenuItem>
                <MenuItem value="stop">Stop Order</MenuItem>
                <MenuItem value="stopLimit">Stop Limit Order</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="quantity"
              label="Quantity"
              type="number"
              fullWidth
              value={orderDetails.quantity}
              onChange={handleOrderDetailsChange}
            />
            {orderType !== "market" && (
              <TextField
                margin="dense"
                name="price"
                label={orderType === "stop" ? "Stop Price" : "Limit Price"}
                type="number"
                fullWidth
                value={orderDetails.price}
                onChange={handleOrderDetailsChange}
              />
            )}
            {orderType === "stopLimit" && (
              <TextField
                margin="dense"
                name="stopPrice"
                label="Stop Price"
                type="number"
                fullWidth
                value={orderDetails.stopPrice}
                onChange={handleOrderDetailsChange}
              />
            )}
            {orderStatus && (
              <Alert severity={orderStatus === "success" ? "success" : "error"}>
                {orderStatus === "success"
                  ? "Order placed successfully!"
                  : "Order failed. Please try again."}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowOrderForm(false)}>Cancel</Button>
            <Button onClick={handleSubmitOrder} variant="contained">
              Place Order
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StockChart;