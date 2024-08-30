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
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from "@mui/material";
import {
  Search,
  Delete,
  Edit,
  TrendingUp,
  TrendingDown,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../NavBar";

const AnimatedTableRow = motion(TableRow);

const StyledTableRow = styled(AnimatedTableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const initialAlerts = [
  {
    id: 1,
    stockName: "AAPL",
    condition: "Price above $150",
    type: "above",
    value: 150,
  },
  {
    id: 2,
    stockName: "GOOGL",
    condition: "Price below $2500",
    type: "below",
    value: 2500,
  },
  {
    id: 3,
    stockName: "MSFT",
    condition: "Price above $300",
    type: "above",
    value: 300,
  },
  {
    id: 4,
    stockName: "AMZN",
    condition: "Price below $3000",
    type: "below",
    value: 3000,
  },
  {
    id: 5,
    stockName: "TSLA",
    condition: "Price above $700",
    type: "above",
    value: 700,
  },
];

const StockAlerts = () => {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const handleEdit = (alert) => {
    setSelectedAlert(alert);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAlert(null);
    setEditMode(false);
  };

  const handleSaveAlert = () => {
    if (editMode) {
      setAlerts(
        alerts.map((alert) =>
          alert.id === selectedAlert.id ? selectedAlert : alert
        )
      );
    } else {
      setAlerts([...alerts, { ...selectedAlert, id: alerts.length + 1 }]);
    }
    handleCloseDialog();
  };

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
          Stock Alerts
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedAlert({
              stockName: "",
              condition: "",
              type: "above",
              value: "",
            });
            setOpenDialog(true);
          }}
          sx={{ mb: 2 }}
        >
          Add New Alert
        </Button>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="stock alerts table">
            <TableHead>
              <TableRow>
                <TableCell>Stock</TableCell>
                <TableCell>Alert Condition</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredAlerts.map((alert) => (
                  <StyledTableRow
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell component="th" scope="row">
                      {alert.stockName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          alert.type === "above" ? (
                            <TrendingUp />
                          ) : (
                            <TrendingDown />
                          )
                        }
                        label={alert.condition}
                        color={alert.type === "above" ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleEdit(alert)}
                        color="primary"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(alert.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editMode ? "Edit Alert" : "Add New Alert"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editMode
                ? "Modify the alert details:"
                : "Enter the details for the new alert:"}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Stock Name"
              fullWidth
              variant="standard"
              value={selectedAlert?.stockName || ""}
              onChange={(e) =>
                setSelectedAlert({
                  ...selectedAlert,
                  stockName: e.target.value,
                })
              }
            />
            <TextField
              select
              margin="dense"
              label="Alert Type"
              fullWidth
              variant="standard"
              value={selectedAlert?.type || "above"}
              onChange={(e) =>
                setSelectedAlert({ ...selectedAlert, type: e.target.value })
              }
              SelectProps={{
                native: true,
              }}
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </TextField>
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              variant="standard"
              value={selectedAlert?.value || ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setSelectedAlert({
                  ...selectedAlert,
                  value,
                  condition: `Price ${selectedAlert.type} $${value}`,
                });
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSaveAlert}>
              {editMode ? "Save Changes" : "Add Alert"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default StockAlerts;
