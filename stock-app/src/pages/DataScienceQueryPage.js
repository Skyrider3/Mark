// // src/components/DataScienceQueryPage.js
// import React, { useState } from 'react';
// import { 
//   Container, Typography, TextField, Button, Box, CircularProgress, 
//   Stepper, Step, StepLabel, Paper, Grid
// } from '@mui/material';
// import axios from 'axios';

// const API_URL = 'http://localhost:8000';

// const DataScienceQueryPage = () => {
//   const [query, setQuery] = useState('');
//   const [processedQuestion, setProcessedQuestion] = useState('');
//   const [generatedCode, setGeneratedCode] = useState('');
//   const [analysisResult, setAnalysisResult] = useState(null);
//   const [outputFiles, setOutputFiles] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [activeStep, setActiveStep] = useState(0);

//   const steps = ['Process Query', 'Generate Code', 'Execute Analysis'];

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!query.trim()) {
//       setError('Please enter a query.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setProcessedQuestion('');
//     setGeneratedCode('');
//     setAnalysisResult(null);
//     setOutputFiles([]);
//     setActiveStep(0);

//     try {
//       const response = await axios.post(`${API_URL}/api/analyze`, { query }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       setProcessedQuestion(response.data.processed_question);
//       setActiveStep(1);
      
//       setGeneratedCode(response.data.generated_code);
//       setActiveStep(2);
      
//       setAnalysisResult(response.data.analysis_result);
//       setOutputFiles(response.data.output_files || []);
//       setActiveStep(3);
//     } catch (error) {
//       console.error('Error in analysis pipeline:', error);
//       setError('An error occurred during the analysis. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" gutterBottom>Data Science Query Executor</Typography>
//       <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Enter your data science query about stock market analysis here..."
//             margin="normal"
//           />
//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             disabled={loading}
//             sx={{ mt: 2 }}
//           >
//             {loading ? 'Analyzing...' : 'Analyze'}
//           </Button>
//         </form>
//       </Paper>

//       {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
//       {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      
//       <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>

//       <Grid container spacing={3}>
//         {processedQuestion && (
//           <Grid item xs={12}>
//             <Paper elevation={2} sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>Processed Question:</Typography>
//               <Typography variant="body1">{processedQuestion}</Typography>
//             </Paper>
//           </Grid>
//         )}

//         {generatedCode && (
//           <Grid item xs={12}>
//             <Paper elevation={2} sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>Generated Code:</Typography>
//               <Box component="pre" sx={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
//                 {generatedCode}
//               </Box>
//             </Paper>
//           </Grid>
//         )}

//         {analysisResult && (
//           <Grid item xs={12}>
//             <Paper elevation={2} sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>Analysis Result:</Typography>
//               <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{analysisResult.result}</Typography>
//               {analysisResult.plot && (
//                 <Box sx={{ mt: 2, textAlign: 'center' }}>
//                   <img src={`data:image/png;base64,${analysisResult.plot}`} alt="Analysis plot" style={{ maxWidth: '100%', height: 'auto' }} />
//                 </Box>
//               )}
//             </Paper>
//           </Grid>
//         )}

//         {outputFiles.length > 0 && (
//           <Grid item xs={12}>
//             <Paper elevation={2} sx={{ p: 2 }}>
//               <Typography variant="h6" gutterBottom>Output Files:</Typography>
//               <ul>
//                 {outputFiles.map((file, index) => (
//                   <li key={index}>
//                     <a href={`${API_URL}/api/output_file/${file.filename}`} target="_blank" rel="noopener noreferrer">
//                       {file.filename}
//                     </a>
//                     {` (${file.size} bytes)`}
//                   </li>
//                 ))}
//               </ul>
//             </Paper>
//           </Grid>
//         )}
//       </Grid>
//     </Container>
//   );
// };

// export default DataScienceQueryPage;

import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DataScienceQueryExecutor from '../components/DataScienceQueryExecutor';

const DataScienceQueryPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Data Science Query
        </Typography>
        <DataScienceQueryExecutor />
      </Box>
    </Container>
  );
};

export default DataScienceQueryPage;