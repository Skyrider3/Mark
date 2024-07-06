// // // import React, { useState } from 'react';
// // // import axios from 'axios';
// // // import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';

// // // const API_URL = 'http://localhost:8000';

// // // const AnalysisForm = () => {
// // //   const [request, setRequest] = useState('');
// // //   const [file, setFile] = useState(null);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState('');

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setLoading(true);
// // //     setError('');

// // //     const formData = new FormData();
// // //     formData.append('request', request);
// // //     if (file) {
// // //       formData.append('file', file);
// // //     }

// // //     try {
// // //       const response = await axios.post(`${API_URL}/analyze`, formData, {
// // //         headers: {
// // //           'Content-Type': 'multipart/form-data',
// // //         },
// // //       });
// // //       // Handle the response (e.g., update chat history)
// // //       console.log(response.data);
// // //       setRequest('');
// // //       setFile(null);
// // //     } catch (err) {
// // //       setError('An error occurred while processing your request.');
// // //       console.error(err);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <Card>
// // //       <CardContent>
// // //         <Typography variant="h6" gutterBottom>Analysis Request</Typography>
// // //         <form onSubmit={handleSubmit}>
// // //           <TextField
// // //             fullWidth
// // //             multiline
// // //             rows={4}
// // //             variant="outlined"
// // //             value={request}
// // //             onChange={(e) => setRequest(e.target.value)}
// // //             placeholder="Enter your stock analysis request here..."
// // //             margin="normal"
// // //           />
// // //           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
// // //             <Button
// // //               variant="contained"
// // //               component="label"
// // //             >
// // //               Upload File
// // //               <input
// // //                 type="file"
// // //                 hidden
// // //                 onChange={(e) => setFile(e.target.files[0])}
// // //               />
// // //             </Button>
// // //             <Button
// // //               type="submit"
// // //               variant="contained"
// // //               color="primary"
// // //               disabled={loading}
// // //             >
// // //               {loading ? 'Analyzing...' : 'Analyze'}
// // //             </Button>
// // //           </Box>
// // //         </form>
// // //         {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
// // //       </CardContent>
// // //     </Card>
// // //   );
// // // };

// // // export default AnalysisForm;

// // // src/components/AnalysisForm.js
// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { Card, CardContent, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// // import { useAppContext } from '../context/AppContext';

// // const API_URL = 'http://localhost:8000';

// // const AnalysisForm = () => {
// //   const [request, setRequest] = useState('');
// //   const [file, setFile] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [analysisType, setAnalysisType] = useState('general');
// //   const { addChatMessage, setError } = useAppContext();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');

// //     const formData = new FormData();
// //     formData.append('request', `${analysisType} analysis: ${request}`);
// //     if (file) {
// //       formData.append('file', file);
// //     }

// //     try {
// //       const response = await axios.post(`${API_URL}/analyze`, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data',
// //         },
// //       });
// //       addChatMessage({ user: request, bot: response.data.result });
// //       setRequest('');
// //       setFile(null);
// //     } catch (err) {
// //       setError('An error occurred while processing your request.');
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Card>
// //       <CardContent>
// //         <Typography variant="h6" gutterBottom>Analysis Request</Typography>
// //         <form onSubmit={handleSubmit}>
// //           <FormControl fullWidth margin="normal">
// //             <InputLabel>Analysis Type</InputLabel>
// //             <Select
// //               value={analysisType}
// //               onChange={(e) => setAnalysisType(e.target.value)}
// //               label="Analysis Type"
// //             >
// //               <MenuItem value="general">General</MenuItem>
// //               <MenuItem value="technical">Technical</MenuItem>
// //               <MenuItem value="sentiment">Sentiment</MenuItem>
// //             </Select>
// //           </FormControl>
// //           <TextField
// //             fullWidth
// //             multiline
// //             rows={4}
// //             variant="outlined"
// //             value={request}
// //             onChange={(e) => setRequest(e.target.value)}
// //             placeholder="Enter your stock analysis request here..."
// //             margin="normal"
// //           />
// //           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
// //             <Button
// //               variant="contained"
// //               component="label"
// //             >
// //               Upload File
// //               <input
// //                 type="file"
// //                 hidden
// //                 onChange={(e) => setFile(e.target.files[0])}
// //               />
// //             </Button>
// //             <Button
// //               type="submit"
// //               variant="contained"
// //               color="primary"
// //               disabled={loading}
// //             >
// //               {loading ? 'Analyzing...' : 'Analyze'}
// //             </Button>
// //           </Box>
// //         </form>
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default AnalysisForm;

// // src/components/AnalysisForm.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Card, CardContent, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
// import { useAppContext } from '../context/AppContext';

// const API_URL = 'http://localhost:8000';

// const AnalysisForm = () => {
//   const [request, setRequest] = useState('');
//   const [file, setFile] = useState(null);
//   const [analysisType, setAnalysisType] = useState('general');
//   const { addChatMessage, error, setError, loading, setLoading } = useAppContext();
//   const [openSnackbar, setOpenSnackbar] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     const formData = new FormData();
//     formData.append('request', `${analysisType} analysis: ${request}`);
//     if (file) {
//       formData.append('file', file);
//     }

//     try {
//       const response = await axios.post(`${API_URL}/analyze`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       addChatMessage({ user: request, bot: response.data.result });
//       setRequest('');
//       setFile(null);
//       setOpenSnackbar(true);
//     } catch (err) {
//       setError('An error occurred while processing your request. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseSnackbar = (event, reason) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setOpenSnackbar(false);
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h6" gutterBottom>Analysis Request</Typography>
//         <form onSubmit={handleSubmit}>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Analysis Type</InputLabel>
//             <Select
//               value={analysisType}
//               onChange={(e) => setAnalysisType(e.target.value)}
//               label="Analysis Type"
//             >
//               <MenuItem value="general">General</MenuItem>
//               <MenuItem value="technical">Technical</MenuItem>
//               <MenuItem value="sentiment">Sentiment</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             value={request}
//             onChange={(e) => setRequest(e.target.value)}
//             placeholder="Enter your stock analysis request here..."
//             margin="normal"
//           />
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
//             <Button
//               variant="contained"
//               component="label"
//             >
//               Upload File
//               <input
//                 type="file"
//                 hidden
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={loading}
//               startIcon={loading ? <CircularProgress size={20} /> : null}
//             >
//               {loading ? 'Analyzing...' : 'Analyze'}
//             </Button>
//           </Box>
//         </form>
//         <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//           <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
//             Analysis completed successfully!
//           </Alert>
//         </Snackbar>
//         {error && (
//           <Alert severity="error" sx={{ mt: 2 }}>
//             {error}
//           </Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AnalysisForm;
import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useAppContext } from '../context/AppContext';

const API_URL = 'http://localhost:8000';

const AnalysisForm = () => {
  const [request, setRequest] = useState('');
  const [file, setFile] = useState(null);
  const [analysisType, setAnalysisType] = useState('general');
  const { addChatMessage, error, setError, loading, setLoading } = useAppContext();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!request.trim()) {
      setError('Please enter an analysis request.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('request', `${analysisType} analysis: ${request}`);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      addChatMessage({ user: request, bot: response.data.result });
      setRequest('');
      setFile(null);
      setOpenSnackbar(true);
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Stock Pattern Analysis</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="analysis-type-label">Analysis Type</InputLabel>
            <Select
              labelId="analysis-type-label"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              label="Analysis Type"
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="technical">Technical</MenuItem>
              <MenuItem value="sentiment">Sentiment</MenuItem>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Button
              variant="contained"
              component="label"
              color="secondary"
            >
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
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Box>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
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