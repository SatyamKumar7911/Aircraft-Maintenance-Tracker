import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        textAlign="center"
      >
        <Typography variant="h1" sx={{ mb: 2, color: 'primary.main' }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The page you're looking for doesn't exist.
        </Typography>
      </Box>
    </Container>
  );
};

export default NotFound;
