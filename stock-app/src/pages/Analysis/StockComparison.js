import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, TextField, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAppContext } from '../../context/AppContext';
import { API_URL } from "../appconfig";

const StockComparison = () => {
  const [symbols, setSymbols] = useState('');
  const [comparisonData, setComparisonData] = useState({});
  const { error, setError, loading, setLoading } = useAppContext();

  const fetchComparisonData = useCallback(async () => {
    if (!symbols.trim()) {
      setError('Please enter stock symbols.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/stock_comparison?symbols=${symbols}&range=1M`);
      setComparisonData(response.data);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setError('Failed to fetch comparison data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [symbols, setLoading, setError]);

  const handleCompare = (e) => {
    e.preventDefault();
    fetchComparisonData();
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Stock Comparison</Typography>
        <form onSubmit={handleCompare}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              value={symbols}
              onChange={(e) => setSymbols(e.target.value.toUpperCase())}
              placeholder="Enter stock symbols (e.g., AAPL,GOOGL,MSFT)"
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
              disabled={loading}
            >
              Compare
            </Button>
          </Box>
        </form>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {Object.keys(comparisonData).length > 0 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell align="right">Start Price</TableCell>
                  <TableCell align="right">End Price</TableCell>
                  <TableCell align="right">Percent Change</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(comparisonData).map(([symbol, data]) => (
                  <TableRow key={symbol}>
                    <TableCell component="th" scope="row">
                      {symbol}
                    </TableCell>
                    <TableCell align="right">${data.start_price?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell align="right">${data.end_price?.toFixed(2) || 'N/A'}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: data.percent_change > 0 ? 'success.main' : 'error.main',
                        fontWeight: 'bold'
                      }}
                    >
                      {data.percent_change?.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default StockComparison;