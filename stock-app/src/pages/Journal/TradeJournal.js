import React, { useState, useMemo } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Collapse,
  InputAdornment,
} from "@mui/material";
import {
  AddCircle,
  TrendingUp,
  TrendingDown,
  KeyboardArrowUp,
  KeyboardArrowDown,
  Search,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../NavBar";

const AnimatedTableRow = motion(TableRow);

const TradeJournal = () => {
  const [trades, setTrades] = useState([
    {
      id: 1,
      entryTime: "2024-08-30T09:30",
      exitTime: "2024-08-30T10:15",
      profit: 150,
      loss: 0,
      notes: "Strong momentum trade",
    },
    {
      id: 2,
      entryTime: "2024-08-30T11:00",
      exitTime: "2024-08-30T11:45",
      profit: 0,
      loss: 75,
      notes: "Stopped out on reversal",
    },
    {
      id: 3,
      entryTime: "2024-08-31T13:30",
      exitTime: "2024-08-31T14:20",
      profit: 200,
      loss: 0,
      notes: "Breakout trade on news",
    },
    {
      id: 4,
      entryTime: "2024-09-01T10:00",
      exitTime: "2024-09-01T11:30",
      profit: 300,
      loss: 0,
      notes: "Trend following trade",
    },
    {
      id: 5,
      entryTime: "2024-09-02T14:00",
      exitTime: "2024-09-02T15:45",
      profit: 0,
      loss: 100,
      notes: "Failed breakout attempt",
    },
  ]);

  const [newTrade, setNewTrade] = useState({
    entryTime: "",
    exitTime: "",
    profit: "",
    loss: "",
    notes: "",
  });

  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrade({ ...newTrade, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tradeToAdd = {
      id: trades.length + 1,
      ...newTrade,
      profit: Number(newTrade.profit),
      loss: Number(newTrade.loss),
    };
    setTrades([...trades, tradeToAdd]);
    setNewTrade({
      entryTime: "",
      exitTime: "",
      profit: "",
      loss: "",
      notes: "",
    });
  };

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const filteredTrades = trades.filter(
    (trade) =>
      trade.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(trade.entryTime).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(trade.exitTime).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = useMemo(() => {
    let accumulatedProfit = 0;
    return trades
      .sort((a, b) => new Date(a.exitTime) - new Date(b.exitTime))
      .map((trade) => {
        accumulatedProfit += trade.profit - trade.loss;
        return {
          date: new Date(trade.exitTime).toLocaleDateString(),
          profit: accumulatedProfit,
        };
      });
  }, [trades]);

  return (
    <>
      <NavBar />
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ mt: 4, mb: 4 }}
        >
          Trade Journal
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Entry Time"
                  type="datetime-local"
                  name="entryTime"
                  value={newTrade.entryTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Exit Time"
                  type="datetime-local"
                  name="exitTime"
                  value={newTrade.exitTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Profit"
                  type="number"
                  name="profit"
                  value={newTrade.profit}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Loss"
                  type="number"
                  name="loss"
                  value={newTrade.loss}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={4}
                  name="notes"
                  value={newTrade.notes}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<AddCircle />}
                >
                  Add Trade
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search trades..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="trade journal table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Entry Time</TableCell>
                <TableCell>Exit Time</TableCell>
                <TableCell align="right">Profit</TableCell>
                <TableCell align="right">Loss</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredTrades.map((trade) => (
                  <React.Fragment key={trade.id}>
                    <AnimatedTableRow
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleRowClick(trade.id)}
                      sx={{ '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' } }}
                    >
                      <TableCell>
                        <IconButton size="small">
                          {expandedRow === trade.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{new Date(trade.entryTime).toLocaleString()}</TableCell>
                      <TableCell>{new Date(trade.exitTime).toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`$${trade.profit}`}
                          color="success"
                          icon={<TrendingUp />}
                          sx={{ display: trade.profit > 0 ? 'inline-flex' : 'none' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`$${trade.loss}`}
                          color="error"
                          icon={<TrendingDown />}
                          sx={{ display: trade.loss > 0 ? 'inline-flex' : 'none' }}
                        />
                      </TableCell>
                      <TableCell>{trade.notes}</TableCell>
                    </AnimatedTableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={expandedRow === trade.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Trade Details
                            </Typography>
                            <Table size="small" aria-label="trade details">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Total Value</TableCell>
                                  <TableCell>Net P/L</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>${(trade.profit + trade.loss).toFixed(2)}</TableCell>
                                  <TableCell>${(trade.profit - trade.loss).toFixed(2)}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ height: 400, mb: 4, mt: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Trade Performance
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Container>
    </>
  );
};

export default TradeJournal;