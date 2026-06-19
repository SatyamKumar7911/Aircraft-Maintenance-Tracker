import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  const theme = useTheme();

  const colorMap = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main
  };

  const bgColorMap = {
    primary: 'rgba(25, 118, 210, 0.08)',
    success: 'rgba(46, 125, 50, 0.08)',
    warning: 'rgba(237, 108, 2, 0.08)',
    error: 'rgba(211, 47, 47, 0.08)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: colorMap[color]
          }
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: 14 }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {value}
              </Typography>
              {trend && (
                <Typography
                  variant="caption"
                  sx={{
                    color: trend > 0 ? theme.palette.success.main : theme.palette.error.main
                  }}
                >
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                backgroundColor: bgColorMap[color],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon sx={{ fontSize: 28, color: colorMap[color] }} />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
