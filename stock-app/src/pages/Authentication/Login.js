// // // // src/components/Login.js
// // // import React, { useState } from 'react';
// // // import { TextField, Button, Typography, Box, Tabs, Tab } from '@mui/material';
// // // import axios from 'axios';

// // // const API_URL = 'http://127.0.0.1:8000';

// // // const Login = ({ onLogin }) => {
// // //   const [username, setUsername] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [error, setError] = useState('');
// // //   const [isLogin, setIsLogin] = useState(true);

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError('');
// // //     try {
// // //       if (isLogin) {
// // //         console.log('Attempting login...');
// // //         const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
// // //           'username': username,
// // //           'password': password
// // //         }), {
// // //           headers: {
// // //             'Content-Type': 'application/x-www-form-urlencoded'
// // //           }
// // //         });
// // //         console.log('Login response:', response.data);
// // //         localStorage.setItem('token', response.data.access_token);
// // //         onLogin();
// // //       } else {
// // //         console.log('Attempting registration...');
// // //         const response = await axios.post(`${API_URL}/register`, { username, password });
// // //         console.log('Registration response:', response.data);
// // //         setError('Registration successful. Please log in.');
// // //         setIsLogin(true);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error during authentication:', error);
// // //       if (error.response) {
// // //         console.error('Error response:', error.response.data);
// // //         setError(error.response.data.detail || 'An error occurred. Please try again.');
// // //       } else if (error.request) {
// // //         console.error('No response received:', error.request);
// // //         setError('Network error. Please check your connection and ensure the server is running.');
// // //       } else {
// // //         console.error('Error setting up request:', error.message);
// // //         setError('An unexpected error occurred. Please try again.');
// // //       }
// // //     }
// // //   };

// // //   return (
// // //     <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
// // //       <Tabs value={isLogin ? 0 : 1} onChange={(e, newValue) => setIsLogin(newValue === 0)} centered>
// // //         <Tab label="Login" />
// // //         <Tab label="Register" />
// // //       </Tabs>
// // //       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
// // //         <TextField
// // //           margin="normal"
// // //           required
// // //           fullWidth
// // //           id="username"
// // //           label="Username"
// // //           name="username"
// // //           autoComplete="username"
// // //           autoFocus
// // //           value={username}
// // //           onChange={(e) => setUsername(e.target.value)}
// // //         />
// // //         <TextField
// // //           margin="normal"
// // //           required
// // //           fullWidth
// // //           name="password"
// // //           label="Password"
// // //           type="password"
// // //           id="password"
// // //           autoComplete="current-password"
// // //           value={password}
// // //           onChange={(e) => setPassword(e.target.value)}
// // //         />
// // //         <Button
// // //           type="submit"
// // //           fullWidth
// // //           variant="contained"
// // //           sx={{ mt: 3, mb: 2 }}
// // //         >
// // //           {isLogin ? 'Sign In' : 'Register'}
// // //         </Button>
// // //         {error && <Typography color="error">{error}</Typography>}
// // //       </Box>
// // //     </Box>
// // //   );
// // // };

// // // export default Login;
// // // src/components/Login.js
// // import React, { useState } from 'react';
// // import { TextField, Button, Typography, Box, Tabs, Tab } from '@mui/material';
// // import axios from 'axios';

// // const API_URL = 'http://127.0.0.1:8000';

// // const Login = ({ onLogin }) => {
// //   const [username, setUsername] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [isLogin, setIsLogin] = useState(true);

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
// //     try {
// //       if (isLogin) {
// //         console.log('Attempting login...');
// //         console.log('Request URL:', `${API_URL}/token`);
// //         console.log('Request payload:', { username, password });
// //         const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
// //           'username': username,
// //           'password': password
// //         }), {
// //           headers: {
// //             'Content-Type': 'application/x-www-form-urlencoded'
// //           }
// //         });
// //         console.log('Login response:', response.data);
// //         localStorage.setItem('token', response.data.access_token);
// //         onLogin();
// //       } else {
// //         console.log('Attempting registration...');
// //         const response = await axios.post(`${API_URL}/register`, { username, password });
// //         console.log('Registration response:', response.data);
// //         setError('Registration successful. Please log in.');
// //         setIsLogin(true);
// //       }
// //     } catch (error) {
// //       console.error('Error during authentication:', error);
// //       if (error.response) {
// //         console.error('Error response:', error.response.data);
// //         console.error('Error status:', error.response.status);
// //         console.error('Error headers:', error.response.headers);
// //         setError(`Error ${error.response.status}: ${error.response.data.detail || 'An error occurred'}`);
// //       } else if (error.request) {
// //         console.error('No response received:', error.request);
// //         setError('Network error. Please check your connection and ensure the server is running.');
// //       } else {
// //         console.error('Error setting up request:', error.message);
// //         setError('An unexpected error occurred. Please try again.');
// //       }
// //     }
// //   };

// //   return (
// //     <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
// //       <Tabs value={isLogin ? 0 : 1} onChange={(e, newValue) => setIsLogin(newValue === 0)} centered>
// //         <Tab label="Login" />
// //         <Tab label="Register" />
// //       </Tabs>
// //       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
// //         <TextField
// //           margin="normal"
// //           required
// //           fullWidth
// //           id="username"
// //           label="Username"
// //           name="username"
// //           autoComplete="username"
// //           autoFocus
// //           value={username}
// //           onChange={(e) => setUsername(e.target.value)}
// //         />
// //         <TextField
// //           margin="normal"
// //           required
// //           fullWidth
// //           name="password"
// //           label="Password"
// //           type="password"
// //           id="password"
// //           autoComplete="current-password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />
// //         <Button
// //           type="submit"
// //           fullWidth
// //           variant="contained"
// //           sx={{ mt: 3, mb: 2 }}
// //         >
// //           {isLogin ? 'Sign In' : 'Register'}
// //         </Button>
// //         {error && <Typography color="error">{error}</Typography>}
// //       </Box>
// //     </Box>
// //   );
// // };

// // export default Login;
// // src/components/Login.js
// import React, { useState } from 'react';
// import { TextField, Button, Typography, Box, Tabs, Tab } from '@mui/material';
// import axios from 'axios';

// const API_URL = 'http://localhost:8000';  // Change this to match your server URL

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
//         console.log('Attempting login...');
//         const response = await axios.post(`${API_URL}/token`, new URLSearchParams({
//           'username': username,
//           'password': password
//         }), {
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//           }
//         });
//         console.log('Login response:', response.data);
//         if (response.data.access_token) {
//           localStorage.setItem('token', response.data.access_token);
//           onLogin();
//         } else {
//           setError('Invalid response from server');
//         }
//       } else {
//         // Registration logic (if needed)
//         const response = await axios.post(`${API_URL}/register`, { username, password });
//         console.log('Registration response:', response.data);
//         setError('Registration successful. Please log in.');
//         setIsLogin(true);
//       }
//     } catch (error) {
//       console.error('Error during authentication:', error);
//       if (error.response) {
//         console.error('Error response:', error.response.data);
//         setError(error.response.data.detail || 'An error occurred');
//       } else if (error.request) {
//         console.error('No response received:', error.request);
//         setError('Network error. Please check your connection and ensure the server is running.');
//       } else {
//         console.error('Error setting up request:', error.message);
//         setError('An unexpected error occurred. Please try again.');
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
//         {error && <Typography color="error">{error}</Typography>}
//       </Box>
//     </Box>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Tabs, Tab, Paper, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
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
        onLogin({ username });
      } else {
        await axios.post(`${API_URL}/register`, { username, password });
        setError('Registration successful. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 400, margin: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        {isLogin ? 'Sign In' : 'Register'}
      </Typography>
      <Tabs value={isLogin ? 0 : 1} onChange={(e, newValue) => setIsLogin(newValue === 0)} centered sx={{ mb: 2 }}>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box component="form" onSubmit={handleSubmit} noValidate>
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
          disabled={loading}
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
        </Button>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>
    </Paper>
  );
};

export default Login;