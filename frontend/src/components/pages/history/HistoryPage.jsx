import React from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Chip
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import { useAircraft } from '../../../hooks/useAircraft';
import { formatDate, getStatusColor } from '../../../utils/helpers';
import { History as HistoryIcon } from '@mui/icons-material';

const HistoryPage = () => {
  const { aircrafts } = useAircraft();

  // Collect all history events from all aircrafts
  const allEvents = [];
  aircrafts.forEach(aircraft => {
    aircraft.history.forEach(event => {
      allEvents.push({
        ...event,
        aircraftId: aircraft.aircraftId,
        aircraftName: aircraft.name
      });
    });
  });

  // Sort by timestamp (newest first)
  const sortedEvents = allEvents.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          📝 Maintenance History
        </Typography>
        <Typography color="text.secondary">
          Complete history of all status changes
        </Typography>
      </Box>

      {sortedEvents.length > 0 ? (
        <Timeline position="alternate">
          {sortedEvents.map((event, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    backgroundColor: event.newStatus
                      ? getStatusColor(event.newStatus)
                      : '#ccc'
                  }}
                >
                  <HistoryIcon sx={{ color: 'white' }} />
                </TimelineDot>
                {index < sortedEvents.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {event.aircraftId}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {event.aircraftName}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {event.previousStatus && (
                        <>
                          <Chip
                            label={event.previousStatus}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(event.previousStatus),
                              color: 'white'
                            }}
                          />
                          <Typography variant="body2">→</Typography>
                        </>
                      )}
                      <Chip
                        label={event.newStatus}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(event.newStatus),
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      {formatDate(event.timestamp, 'MMM DD, YYYY HH:mm')}
                    </Typography>
                    {event.engineerName && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        by {event.engineerName}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">
              No maintenance history yet
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default HistoryPage;
