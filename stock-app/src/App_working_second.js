// // // // src/App.js
// // // import React from 'react';
// // // import { AppBar, Toolbar, Typography, Container, Grid, Box } from '@mui/material';
// // // import { createTheme, ThemeProvider } from '@mui/material/styles';
// // // import StockChart from './components/StockChart';
// // // import AnalysisForm from './components/AnalysisForm';
// // // import ChatHistory from './components/ChatHistory';
// // // import ChatInput from './components/ChatInput';
// // // import StockComparison from './components/StockComparison';
// // // import { AppProvider } from './context/AppContext';

// // // const theme = createTheme({
// // //   palette: {
// // //     primary: {
// // //       main: '#1976d2',
// // //     },
// // //     secondary: {
// // //       main: '#dc004e',
// // //     },
// // //   },
// // // });

// // // const App = () => {
// // //   return (
// // //     <ThemeProvider theme={theme}>
// // //       <AppProvider>
// // //         <AppBar position="static">
// // //           <Toolbar>
// // //             <Typography variant="h6">Stock Market Analysis Assistant</Typography>
// // //           </Toolbar>
// // //         </AppBar>
// // //         <Container maxWidth="lg" sx={{ mt: 4 }}>
// // //           <Grid container spacing={3}>
// // //             <Grid item xs={12} md={6}>
// // //               <StockChart />
// // //             </Grid>
// // //             <Grid item xs={12} md={6}>
// // //               <AnalysisForm />
// // //             </Grid>
// // //             <Grid item xs={12}>
// // //               <StockComparison />
// // //             </Grid>
// // //             <Grid item xs={12}>
// // //               <Box sx={{ display: 'flex', flexDirection: 'column' }}>
// // //                 <ChatHistory />
// // //                 <ChatInput />
// // //               </Box>
// // //             </Grid>
// // //           </Grid>
// // //         </Container>
// // //       </AppProvider>
// // //     </ThemeProvider>
// // //   );
// // // };

// // // export default App;

// // // src/App.js
// // import React, { useState, useEffect } from 'react';
// // import { AppBar, Toolbar, Typography, Container, Grid, Box, Button } from '@mui/material';
// // import { createTheme, ThemeProvider } from '@mui/material/styles';
// // import StockChart from './components/StockChart';
// // import AnalysisForm from './components/AnalysisForm';
// // import ChatHistory from './components/ChatHistory';
// // import ChatInput from './components/ChatInput';
// // import StockComparison from './components/StockComparison';
// // import Login from './components/Login';
// // import Watchlist from './components/Watchlist';
// // import { AppProvider } from './context/AppContext';

// // const theme = createTheme({
// //   palette: {
// //     primary: {
// //       main: '#1976d2',
// //     },
// //     secondary: {
// //       main: '#dc004e',
// //     },
// //   },
// // });

// // const App = () => {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       setIsLoggedIn(true);
// //     }
// //   }, []);

// //   const handleLogin = () => {
// //     setIsLoggedIn(true);
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem('token');
// //     setIsLoggedIn(false);
// //   };

// //   return (
// //     <ThemeProvider theme={theme}>
// //       <AppProvider>
// //         <AppBar position="static">
// //           <Toolbar>
// //             <Typography variant="h6" sx={{ flexGrow: 1 }}>Stock Market Analysis Assistant</Typography>
// //             {isLoggedIn && (
// //               <Button color="inherit" onClick={handleLogout}>Logout</Button>
// //             )}
// //           </Toolbar>
// //         </AppBar>
// //         <Container maxWidth="lg" sx={{ mt: 4 }}>
// //           {!isLoggedIn ? (
// //             <Login onLogin={handleLogin} />
// //           ) : (
// //             <Grid container spacing={3}>
// //               <Grid item xs={12} md={8}>
// //                 <StockChart />
// //               </Grid>
// //               <Grid item xs={12} md={4}>
// //                 <Watchlist />
// //               </Grid>
// //               <Grid item xs={12} md={6}>
// //                 <AnalysisForm />
// //               </Grid>
// //               <Grid item xs={12} md={6}>
// //                 <StockComparison />
// //               </Grid>
// //               <Grid item xs={12}>
// //                 <Box sx={{ display: 'flex', flexDirection: 'column' }}>
// //                   <ChatHistory />
// //                   <ChatInput />
// //                 </Box>
// //               </Grid>
// //             </Grid>
// //           )}
// //         </Container>
// //       </AppProvider>
// //     </ThemeProvider>
// //   );
// // };

// // export default App;
// // src/components/Login.js
// import React, { useState } from 'react';
// import { TextField, Button, Typography, Box, Tabs, Tab } from '@mui/material';
// import axios from 'axios';

// const API_URL = 'http://localhost:8000';

// const Login = ({ onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLogin, setIsLogin] = useState(true);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       if (isLogin) {
//         const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
//           'username': username,
//           'password': password
//         }), {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//           }
//         });
//         localStorage.setItem('token', response.data.access_token);
//         onLogin();
//       } else {
//         await axios.post(`${API_URL}/register`, { username, password });
//         setIsLogin(true);
//         setError('Registration successful. Please log in.');
//       }
//     } catch (error) {
//       if (error.response) {
//         setError(error.response.data.detail || 'An error occurred. Please try again.');
//       } else {
//         setError('Network error. Please check your connection.');
//       }
//     }
//   };

//   return (
//     <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
//       <Tabs value={isLogin ? 0 : 1} onChange={(e, newValue) => setIsLogin(newValue === 0)} centered>
//         <Tab label="Login" />
//         <Tab label="Register" />
//       </Tabs>
//       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="username"
//           label="Username"
//           name="username"
//           autoComplete="username"
//           autoFocus
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           name="password"
//           label="Password"
//           type="password"
//           id="password"
//           autoComplete="current-password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           sx={{ mt: 3, mb: 2 }}
//         >
//           {isLogin ? 'Sign In' : 'Register'}
//         </Button>
//         {error && <Typography color="error" align="center">{error}</Typography>}
//       </Box>
//     </Box>
//   );
// };

// export default Login;

// src/components/Login.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Tabs, Tab } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
          'username': username,
          'password': password
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        localStorage.setItem('token', response.data.access_token);
        onLogin();
      } else {
        // Registration
        await axios.post(`${API_URL}/register`, { username, password });
        setError('Registration successful. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.detail || 'An error occurred. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Tabs value={isLogin ? 0 : 1} onChange={(e, newValue) => setIsLogin(newValue === 0)} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isLogin ? 'Sign In' : 'Register'}
        </Button>
        {error && <Typography color="error" align="center">{error}</Typography>}
      </Box>
    </Box>
  );
};

export default Login;