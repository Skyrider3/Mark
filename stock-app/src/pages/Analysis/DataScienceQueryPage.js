import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import DataScienceQueryExecutor from './DataScienceQueryExecutor';

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