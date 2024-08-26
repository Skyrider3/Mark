import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AppBar, Toolbar, Typography, TextField, Button, Container, Grid, 
  Card, CardContent, CardMedia, IconButton, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import axios from 'axios';
import NavBar from '../NavBar';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNews = async (stock = '') => {
    setLoading(true);
    try {
      // Replace this URL with an actual financial news API
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=0afba4fa912b4df185b1cc663c51f960${stock ? `&q=${stock}` : ''}`);
      setNews(response.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setNews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(searchTerm);
  };

  return (
    <>
    <NavBar />
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearch} style={{ margin: '2rem 0' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a stock symbol (e.g., AAPL)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </motion.div>

      {loading ? (
        <Typography variant="h5" align="center">Loading news...</Typography>
      ) : news.length === 0 ? (
        <Typography variant="h5" align="center">No news found. Try a different search term.</Typography>
      ) : (
        <Grid container spacing={4}>
          {news.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StyledCard>
                  {item.urlToImage && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.urlToImage}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description || "No description available."}
                    </Typography>
                  </CardContent>
                  <Button size="small" color="primary" href={item.url} target="_blank" rel="noopener noreferrer">
                    Read More
                  </Button>
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    </>
  );
};

export default NewsPage;