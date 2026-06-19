import React from 'react';
import { Container, Box, Card, CardContent, Grid, Typography, Chip } from '@mui/material';
import { useAircraft } from '../../../hooks/useAircraft';
import { formatTime, getStatusColor, getStatusLabel } from '../../../utils/helpers';
import { Today as TodayIcon } from '@mui/icons-material';

const TodaySchedulePage = () => {
  const { getTodayAircrafts } = useAircraft();
  const todayAircrafts = getTodayAircrafts();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          📅 Today's Schedule
        </Typography>
        <Typography color="text.secondary">
          {todayAircrafts.length} aircraft{todayAircrafts.length !== 1 ? 's' : ''} scheduled for today
        </Typography>
      </Box>

      {todayAircrafts.length > 0 ? (
        <Grid container spacing={3}>
          {todayAircrafts.map((aircraft) => (
            <Grid item xs={12} sm={6} md={4} key={aircraft.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {aircraft.aircraftId}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {aircraft.name}
                      </Typography>
                    </Box>
                    <TodayIcon sx={{ color: 'warning.main', fontSize: 28 }} />
                  </Box>

                  <Box sx={{ my: 2 }}>
                    <Chip
                      label={getStatusLabel(aircraft.status)}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(aircraft.status),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>

                  <Box sx={{ space: 1 }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <strong>Engineer:</strong> {aircraft.engineerName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      <strong>Status:</strong> {aircraft.status}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              No aircraft scheduled for today
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default TodaySchedulePage;
