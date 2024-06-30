import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Alert, Stepper, Step, StepLabel } from '@mui/material';

const API_URL = 'http://localhost:8000';

const DataScienceQueryExecutor = () => {
  const [query, setQuery] = useState('');
  const [processedQuestion, setProcessedQuestion] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Process Query', 'Generate Code', 'Execute Analysis'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a query.');
      return;
    }
    setLoading(true);
    setError('');
    setProcessedQuestion('');
    setGeneratedCode('');
    setAnalysisResult(null);
    setActiveStep(0);

    try {
      const response = await axios.post(`${API_URL}/api/analyze`, { query }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setProcessedQuestion(response.data.processed_question);
      setActiveStep(1);
      
      setGeneratedCode(response.data.generated_code);
      setActiveStep(2);
      
      setAnalysisResult(response.data.analysis_result);
      setActiveStep(3);
    } catch (error) {
      console.error('Error in analysis pipeline:', error);
      setError('An error occurred during the analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Data Science Query Executor</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your data science query about stock market analysis here..."
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </form>
        {loading && <CircularProgress sx={{ mt: 2 }} />}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {processedQuestion && (
          <Box mt={2}>
            <Typography variant="h6">Processed Question:</Typography>
            <Typography variant="body1">{processedQuestion}</Typography>
          </Box>
        )}

        {generatedCode && (
          <Box mt={2}>
            <Typography variant="h6">Generated Code:</Typography>
            <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', padding: '10px' }}>
              {generatedCode}
            </pre>
          </Box>
        )}

        {analysisResult && (
          <Box mt={2}>
            <Typography variant="h6">Analysis Result:</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{analysisResult.result}</Typography>
            {analysisResult.plot && (
              <img src={`data:image/png;base64,${analysisResult.plot}`} alt="Analysis plot" style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DataScienceQueryExecutor;