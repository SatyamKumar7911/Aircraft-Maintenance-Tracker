import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  Chip
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { useAircraft } from '../../../hooks/useAircraft';
import StatCard from '../../shared/StatCard.jsx';
import {
  AirplanemodeActive as AircraftIcon,
  Schedule as ScheduledIcon,
  Construction as MaintenanceIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const theme = useTheme();
  const { aircrafts, getStatistics, getActiveAircrafts } = useAircraft();
  const [stats, setStats] = useState({ total: 0, scheduled: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    const statistics = getStatistics();
    setStats(statistics);
  }, [aircrafts, getStatistics]);

  // Status data - filter out zero values
  const allStatusData = [
    { name: 'Scheduled', value: stats.scheduled, fill: '#ed6c02' },
    { name: 'In Progress', value: stats.inProgress, fill: '#1976d2' },
    { name: 'Completed', value: stats.completed, fill: '#2e7d32' }
  ];

  const statusData = useMemo(() => {
    return allStatusData.filter(item => item.value > 0);
  }, [stats.scheduled, stats.inProgress, stats.completed]);

  // Check if only one category has data
  const hasSingleValue = statusData.length === 1;
  const hasMultipleValues = statusData.length > 1;

  // Custom label renderer - only for multi-value charts
  const renderCustomLabel = (props) => {
    const { value, percent } = props;
    // Only show label if value > 0 AND percent > 1%
    if (value > 0 && percent > 0.01 && hasMultipleValues) {
      return `${(percent * 100).toFixed(0)}%`;
    }
    return null;
  };

  // Center label for single value case
  const renderCenterLabel = () => {
    if (hasSingleValue && statusData[0]) {
      const item = statusData[0];
      const percent = ((item.value / stats.total) * 100).toFixed(0);
      return (
        <text 
          x="50%" 
          y="50%" 
          textAnchor="middle" 
          dominantBaseline="middle"
          style={{
            fontSize: '18px',
            fontWeight: 700,
            fill: theme.palette.text.primary,
            pointerEvents: 'none'
          }}
        >
          <tspan x="50%" dy="0">
            {item.name}
          </tspan>
          <tspan x="50%" dy="24" style={{ fontSize: '24px' }}>
            {percent}%
          </tspan>
        </text>
      );
    }
    return null;
  };

  const activeAircrafts = getActiveAircrafts();
  const completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white',
          p: 4,
          borderRadius: 2,
          mb: 4
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          ✈️ Welcome to Aircraft Maintenance Tracker
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Real-time monitoring of aircraft maintenance operations
        </Typography>
      </Box>

      {/* Key Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Aircrafts"
            value={stats.total}
            icon={AircraftIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Scheduled"
            value={stats.scheduled}
            icon={ScheduledIcon}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="In Progress"
            value={stats.inProgress}
            icon={MaintenanceIcon}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={CompletedIcon}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                📊 Status Distribution
              </Typography>
              {stats.total > 0 && statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={hasSingleValue ? 300 : 360}>
                  <PieChart margin={{ top: 20, right: 30, bottom: 40, left: 30 }}>
                    <Pie
                      data={statusData}
                      cx={hasSingleValue ? "50%" : "50%"}
                      cy={hasSingleValue ? "45%" : "50%"}
                      labelLine={hasMultipleValues}
                      label={hasMultipleValues ? renderCustomLabel : false}
                      outerRadius={hasSingleValue ? 90 : 75}
                      innerRadius={0}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                      isAnimationActive
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill}
                          style={{ outline: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                        />
                      ))}
                    </Pie>
                    {hasSingleValue && renderCenterLabel()}
                    <Tooltip 
                      formatter={(value) => [value, 'Count']}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `2px solid ${theme.palette.divider}`,
                        borderRadius: '8px',
                        padding: '10px 12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      labelStyle={{ color: theme.palette.text.primary, fontWeight: 600 }}
                      cursor={{ fill: 'transparent' }}
                    />
                    {hasMultipleValues && (
                      <Legend 
                        verticalAlign="bottom" 
                        height={30}
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                        formatter={(value, entry) => {
                          return `${entry.payload.name} (${entry.payload.value})`;
                        }}
                      />
                    )}
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px' }}>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    📭
                  </Typography>
                  <Typography color="text.secondary">
                    No aircraft data available
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    Add aircraft to see status distribution
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Progress */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                ✅ Completion Rate
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Overall Progress</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {completionRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={completionRate}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Completed
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.completed}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      In Progress
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.inProgress}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="text.secondary" variant="caption">
                      Scheduled
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {stats.scheduled}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Maintenance */}
      {activeAircrafts.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              🚧 Currently in Maintenance ({activeAircrafts.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {activeAircrafts.map((aircraft) => (
                <Chip
                  key={aircraft.id}
                  label={`${aircraft.aircraftId} - ${aircraft.name}`}
                  icon={<MaintenanceIcon />}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
