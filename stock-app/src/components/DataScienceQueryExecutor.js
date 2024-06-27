// import React, { useState } from 'react';
// import axios from 'axios';
// import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

// const API_URL = 'http://localhost:8000';

// const DataScienceQueryExecutor = () => {
//   const [query, setQuery] = useState('');
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!query.trim()) {
//       setError('Please enter a query.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setResult(null);

//     try {
//       //const response = await axios.post(`${API_URL}/execute_query`, { query }, {
//         const response = await axios.post(`${API_URL}/api/process-query`, { query }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       setResult(response.data);
//     } catch (error) {
//       console.error('Error executing query:', error);
//       setError('An error occurred while executing the query. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>Data Science Query Executor</Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Enter your data science query here..."
//             margin="normal"
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={loading}
//             sx={{ mt: 2 }}
//           >
//             {loading ? 'Executing...' : 'Execute Query'}
//           </Button>
//         </form>
//         {loading && <CircularProgress sx={{ mt: 2 }} />}
//         {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//         {result && (
//           <Box mt={2}>
//             <Typography variant="h6">Result:</Typography>
//             {result.type === 'text' && (
//               <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{result.data}</Typography>
//             )}
//             {result.type === 'image' && (
//               <img src={`data:image/png;base64,${result.data}`} alt="Query result" style={{ maxWidth: '100%', height: 'auto' }} />
//             )}
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default DataScienceQueryExecutor;

import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, Button, Box, CircularProgress, Alert, Stepper, Step, StepLabel } from '@mui/material';

const API_URL = 'http://localhost:8000';

const DataScienceQueryExecutor = () => {
  const [query, setQuery] = useState('');
  const [formattedQuestion, setFormattedQuestion] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [result, setResult] = useState(null);
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
    setResult(null);
    setFormattedQuestion('');
    setGeneratedCode('');
    setActiveStep(0);

    try {
      // Step 1: Process Query
      const processResponse = await axios.post(`${API_URL}/api/process-query`, { query }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormattedQuestion(processResponse.data.question);
      setActiveStep(1);

      // Step 2: Generate Code
      const codeResponse = await axios.post(`${API_URL}/api/generate-code`, { question: processResponse.data.question }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setGeneratedCode(codeResponse.data.code);
      setActiveStep(2);

      // Step 3: Execute Analysis
      const analysisResponse = await axios.post(`${API_URL}/api/execute-analysis`, { code: codeResponse.data.code }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setResult(analysisResponse.data);
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

        {formattedQuestion && (
          <Box mt={2}>
            <Typography variant="h6">Formatted Question:</Typography>
            <Typography variant="body1">{formattedQuestion}</Typography>
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

        {result && (
          <Box mt={2}>
            <Typography variant="h6">Analysis Result:</Typography>
            {result.result && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{result.result}</Typography>
            )}
            {result.plot && (
              <img src={`data:image/png;base64,${result.plot}`} alt="Analysis plot" style={{ maxWidth: '100%', height: 'auto', marginTop: '10px' }} />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DataScienceQueryExecutor;