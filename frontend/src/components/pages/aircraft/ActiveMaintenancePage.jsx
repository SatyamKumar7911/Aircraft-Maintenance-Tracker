import React from 'react';
import { Container, Box, Card, CardContent, Grid, Typography, Chip } from '@mui/material';
import { useAircraft } from '../../../hooks/useAircraft';
import { formatDateShort, getStatusColor, getStatusLabel } from '../../../utils/helpers';
import { Construction as MaintenanceIcon } from '@mui/icons-material';

const ActiveMaintenancePage = () => {
  const { getActiveAircrafts } = useAircraft();
  const activeAircrafts = getActiveAircrafts();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          🚧 Active Maintenance
        </Typography>
        <Typography color="text.secondary">
          {activeAircrafts.length} aircraft{activeAircrafts.length !== 1 ? 's' : ''} currently in maintenance
        </Typography>
      </Box>

      {activeAircrafts.length > 0 ? (
        <Grid container spacing={3}>
          {activeAircrafts.map((aircraft) => (
            <Grid item xs={12} sm={6} md={4} key={aircraft.id}>
              <Card sx={{ h: '100%' }}>
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
                    <MaintenanceIcon sx={{ color: 'primary.main', fontSize: 28 }} />
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
                      <strong>Date:</strong> {formatDateShort(aircraft.maintenanceDate)}
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
              No aircraft currently in maintenance
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ActiveMaintenancePage;
