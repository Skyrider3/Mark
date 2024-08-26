import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAppContext } from "../../context/AppContext";

const API_URL = "http://localhost:8000";

const AnalysisForm = ({
  selectedStock,
  apiEndpoint,
  componentName,
  menu,
}) => {
  const [request, setRequest] = useState("");
  const [file, setFile] = useState(null);
  const [analysisType, setAnalysisType] = useState("general");
  const { addChatMessage, error, setError, loading, setLoading } =
    useAppContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.trim()) {
      setError("Please enter an analysis request.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("request", `${analysisType} analysis: ${request}`);
    formData.append("stock", selectedStock);
    formData.append("type", analysisType);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post(`${API_URL}/${apiEndpoint}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      addChatMessage({ user: request, bot: response.data.result });
      setRequest("");
      setFile(null);
      setOpenSnackbar(true);
    } catch (err) {
      setError(
        "An error occurred while processing your request. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  console.log('menu name:', menu.menuName); // For debugging
  console.log('menu items:', menu.menuItems); // For debugging

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {componentName ? componentName : "Stock Pattern Analysis"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="analysis-type-label">{menu.menuName}</InputLabel>
            <Select
              labelId="analysis-type-label"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              label={menu.menuName}
            >
              {menu.menuItems && menu.menuItems.length > 0 ? (
                menu.menuItems.map((menuItem) => (
                  <MenuItem key={menuItem.key} value={menuItem.key}>
                    {menuItem.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No items available</MenuItem>
              )}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Enter your stock analysis request here..."
            margin="normal"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Button variant="contained" component="label" color="secondary">
              Upload File
              <input
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Chat
              {/* {loading ? "Analyzing..." : "Chat"} */}
            </Button>
          </Box>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Analysis completed successfully!
          </Alert>
        </Snackbar>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalysisForm;
