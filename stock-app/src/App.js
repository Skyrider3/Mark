// // src/App.js
// import React, { useState, useEffect } from 'react';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { Container, Box, Typography, AppBar, Toolbar, Button, Grid } from '@mui/material';
// import Login from './components/Login';
// import StockChart from './components/StockChart';
// import AnalysisForm from './components/AnalysisForm';
// import ChatHistory from './components/ChatHistory';
// import StockComparison from './components/StockComparison';
// import DataScienceQuery from './components/DataScienceQuery';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [selectedStock, setSelectedStock] = useState('AAPL'); // Default to Apple Inc.
//   const [chatHistory, setChatHistory] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Here you would typically verify the token with your backend
//       setIsAuthenticated(true);
//       // For now, we'll just set a dummy user
//       setCurrentUser({ username: 'User' });
//     }
//   }, []);

//   const handleLogin = (user) => {
//     setIsAuthenticated(true);
//     setCurrentUser(user);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setIsAuthenticated(false);
//     setCurrentUser(null);
//   };

//   const handleStockSelect = (stock) => {
//     setSelectedStock(stock);
//   };

//   const handleNewChatMessage = (message) => {
//     setChatHistory(prevHistory => [...prevHistory, message]);
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             Stock Market Analysis Assistant
//           </Typography>
//           {isAuthenticated && (
//             <>
//               <Typography variant="subtitle1" sx={{ mr: 2 }}>
//                 Welcome, {currentUser?.username}
//               </Typography>
//               <Button color="inherit" onClick={handleLogout}>
//                 Logout
//               </Button>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth="lg">
//         <Box sx={{ my: 4 }}>
//           {!isAuthenticated ? (
//             <Login onLogin={handleLogin} />
//           ) : (
//             <Grid container spacing={3}>
//               <Grid item xs={12} md={8}>
//                 <StockChart stock={selectedStock} />
//               </Grid>
//               <Grid item xs={12} md={4}>
//                 <AnalysisForm
//                   onStockSelect={handleStockSelect}
//                   onAnalysisRequest={handleNewChatMessage}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <StockComparison />
//               </Grid>
//               <Grid item xs={12}>
//                 <ChatHistory
//                   history={chatHistory}
//                   onNewMessage={handleNewChatMessage}
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <DataScienceQuery />
//               </Grid>
//             </Grid>
//           )}
//         </Box>
//       </Container>
//     </ThemeProvider>
//   );
// }

// export default App;
// import React, { useState, useEffect } from 'react';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { Container, Box, Typography, AppBar, Toolbar, Button, Grid, Paper } from '@mui/material';
// import Login from './components/Login';
// import StockChart from './components/StockChart';
// import AnalysisForm from './components/AnalysisForm';
// import ChatHistory from './components/ChatHistory';
// import StockComparison from './components/StockComparison';
// // import DataScienceQueryExecutor from './components/DataScienceQueryExecutor';
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, AppBar, Toolbar, Button, Grid, Paper } from '@mui/material';
import Login from './components/Login';
import StockChart from './components/StockChart';
import AnalysisForm from './components/AnalysisForm';
import ChatHistory from './components/ChatHistory';
import StockComparison from './components/StockComparison';
import DataScienceQueryExecutor from './components/DataScienceQueryExecutor';


import { AppProvider } from './context/AppContext';




const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentUser({ username: 'User' }); // Replace with actual user data fetching
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleNewChatMessage = (message) => {
    setChatHistory(prevHistory => [...prevHistory, message]);
  };

  return (
    <AppProvider>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static">
            <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Stock Market Analysis Assistant
            </Typography>
            {isAuthenticated && (
                <>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                    Welcome, {currentUser?.username}
                </Typography>
                <Button color="inherit" onClick={handleLogout}>
                    Logout
                </Button>
                </>
            )}
            </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {!isAuthenticated ? (
            <Login onLogin={handleLogin} />
            ) : (
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" gutterBottom>Stock Chart</Typography>
                    <StockChart stock={selectedStock} />
                </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <AnalysisForm
                    onStockSelect={handleStockSelect}
                    onAnalysisRequest={handleNewChatMessage}
                    />
                </Paper>
                </Grid>
                <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <StockComparison />
                </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                    <ChatHistory
                    history={chatHistory}
                    onNewMessage={handleNewChatMessage}
                    />
                </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                    <DataScienceQueryExecutor />
                </Paper>
                </Grid> 
            </Grid>
            )}
        </Container>
        </ThemeProvider>
    </AppProvider>
  );
}

export default App;