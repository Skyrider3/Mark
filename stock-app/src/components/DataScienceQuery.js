// src/components/DataScienceQuery.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const DataScienceQuery = () => {
  const [query, setQuery] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('query', query);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(`${API_URL}/execute_query`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error executing query:', error);
      setError('An error occurred while executing the query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Data Science Query</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your data science query here..."
          margin="normal"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: '10px' }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Executing...' : 'Execute Query'}
        </Button>
      </form>
      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {result && (
        <Box mt={2}>
          <Typography variant="h6">Result:</Typography>
          {result.type === 'text' && (
            <Typography>{result.data}</Typography>
          )}
          {result.type === 'image' && (
            <img src={`data:image/png;base64,${result.data}`} alt="Query result" />
          )}
        </Box>
      )}
    </Box>
  );
};

export default DataScienceQuery;