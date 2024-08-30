import React from 'react';
import { motion } from 'framer-motion';
import { 
  AppBar, Toolbar, Typography, Button, Container, Grid, 
  Card, CardContent, Box, Link
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import landing from '../../image/landing.jpg';

const BackgroundImage = styled('div')(({ theme }) => ({
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust this value to control darkness
      zIndex: -1,
    },
    backgroundImage: `url(${landing})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -2, // Changed to -2 so it's behind the overlay
  }));

const GlassCard = styled(Card)({
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(5px)',
  borderRadius: '10px',
  padding: '20px',
  color: 'white',
});

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <BackgroundImage />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
            Profitable Trader
          </Typography>
          <Button color="inherit" component={Link} sx={{ color: 'white' }} onClick={()=>navigate('/login')}>SIGN IN</Button>
          <Button color="inherit" component={Link} sx={{ color: 'white' }} onClick={()=>navigate('/login')}>SIGN UP</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlassCard>
                <CardContent>
                  <Typography variant="h3" gutterBottom sx={{ color: 'white' }}>
                    Unlock Your Trading Potential
                  </Typography>
                  <Typography variant="h5" paragraph sx={{ color: 'white' }}>
                    Join thousands of successful traders who have transformed their 
                    financial future with Profitable Trader.
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                    Our cutting-edge AI-powered platform provides real-time insights, 
                    advanced analytics, and personalized strategies to help you make 
                    informed decisions and maximize your profits.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button 
                      variant="contained" 
                      size="large" 
                      sx={{ mr: 2, bgcolor: '#2196f3', '&:hover': { bgcolor: '#1976d2' } }}
                      onClick={()=>navigate('/login')}
                    >
                      START YOUR JOURNEY
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="large" 
                      sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
                      onClick={()=>navigate('/login')}
                    >
                      ALREADY A MEMBER? SIGN IN
                    </Button>
                  </Box>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <GlassCard>
                <CardContent>
                  <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
                    Why Choose Profitable Trader?
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                    • AI-powered market analysis
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                    • Real-time trading signals
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                    • Personalized risk management analysis
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                    • AI expert trading advisors
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ color: 'white' }}>
                    • Documented trade management
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    • AI strategist who finds patterns
                  </Typography>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default LandingPage;