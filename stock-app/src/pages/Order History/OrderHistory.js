import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  TrendingUp,
  TrendingDown,
  Search,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../NavBar";

const AnimatedTableRow = motion(TableRow);

const StyledTableRow = styled(AnimatedTableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const orderData = [
  {
    id: 1,
    stockName: "AAPL",
    action: "Buy",
    quantity: 100,
    price: 150.25,
    commission: 5.99,
    pl: 1025.01,
    time: "2024-08-30 10:15:30",
    orderType: "Market",
  },
  {
    id: 2,
    stockName: "GOOGL",
    action: "Sell",
    quantity: 50,
    price: 2750.6,
    commission: 5.99,
    pl: -520.99,
    time: "2024-08-30 11:30:45",
    orderType: "Limit",
  },
  {
    id: 3,
    stockName: "MSFT",
    action: "Buy",
    quantity: 75,
    price: 305.52,
    commission: 5.99,
    pl: 789.51,
    time: "2024-08-30 13:45:00",
    orderType: "Stop",
  },
  {
    id: 4,
    stockName: "AMZN",
    action: "Sell",
    quantity: 25,
    price: 3300.75,
    commission: 5.99,
    pl: 1250.76,
    time: "2024-08-30 15:00:15",
    orderType: "Market",
  },
  {
    id: 5,
    stockName: "TSLA",
    action: "Buy",
    quantity: 40,
    price: 725.6,
    commission: 5.99,
    pl: -320.99,
    time: "2024-08-31 09:30:30",
    orderType: "Limit",
  },
  {
    id: 6,
    stockName: "FB",
    action: "Sell",
    quantity: 60,
    price: 365.25,
    commission: 5.99,
    pl: 895.01,
    time: "2024-08-31 10:45:45",
    orderType: "Stop",
  },
  {
    id: 7,
    stockName: "NFLX",
    action: "Buy",
    quantity: 30,
    price: 550.5,
    commission: 5.99,
    pl: -175.99,
    time: "2024-08-31 14:15:00",
    orderType: "Market",
  },
  {
    id: 8,
    stockName: "NVDA",
    action: "Sell",
    quantity: 45,
    price: 220.75,
    commission: 5.99,
    pl: 620.76,
    time: "2024-09-01 11:30:15",
    orderType: "Limit",
  },
];

const OrderHistory = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleRowClick = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const filteredOrders = orderData.filter(
    (order) =>
      order.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderType.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          Order History
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search orders..."
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
          <Table sx={{ minWidth: 700 }} aria-label="order history table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Stock</TableCell>
                <TableCell>Action</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Commission</TableCell>
                <TableCell align="right">P/L</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredOrders.map((row) => (
                  <React.Fragment key={row.id}>
                    <StyledTableRow
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleRowClick(row.id)}
                      sx={{
                        "&:hover": {
                          backgroundColor: "action.hover",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <TableCell>
                        <IconButton size="small">
                          {expandedRow === row.id ? (
                            <KeyboardArrowUp />
                          ) : (
                            <KeyboardArrowDown />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.stockName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.action}
                          color={row.action === "Buy" ? "success" : "error"}
                          icon={
                            row.action === "Buy" ? (
                              <TrendingUp />
                            ) : (
                              <TrendingDown />
                            )
                          }
                        />
                      </TableCell>
                      <TableCell align="right">{row.quantity}</TableCell>
                      <TableCell align="right">
                        ${row.price.toFixed(2)}
                      </TableCell>
                      <TableCell align="right">
                        ${row.commission.toFixed(2)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: row.pl >= 0 ? "success.main" : "error.main",
                          fontWeight: "bold",
                        }}
                      >
                        ${row.pl.toFixed(2)}
                      </TableCell>
                      <TableCell>{row.time}</TableCell>
                      <TableCell>{row.orderType}</TableCell>
                    </StyledTableRow>
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={9}
                      >
                        <Collapse
                          in={expandedRow === row.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Typography
                              variant="h6"
                              gutterBottom
                              component="div"
                            >
                              Order Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Total Value</TableCell>
                                  <TableCell>Net P/L</TableCell>
                                  <TableCell>Market Conditions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>
                                    ${(row.quantity * row.price).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    ${(row.pl - row.commission).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                    Sample market conditions...
                                  </TableCell>
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
      </Container>
    </>
  );
};

export default OrderHistory;
