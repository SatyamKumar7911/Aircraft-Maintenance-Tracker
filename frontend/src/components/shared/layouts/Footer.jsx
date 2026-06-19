import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';

const Footer = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.02)',
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 1
            }}
          >
            Made with ❤️ by Satyam Kumar
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary
            }}
          >
            © 2026 All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
