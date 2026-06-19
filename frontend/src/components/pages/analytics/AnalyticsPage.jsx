import React, { useMemo } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useAircraft } from '../../../hooks/useAircraft';

const AnalyticsPage = () => {
  const theme = useTheme();
  const { aircrafts, getStatistics } = useAircraft();

  const stats = getStatistics();

  // Status distribution - filter out zero values
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

  // Engineer workload
  const engineerWorkload = useMemo(() => {
    const workload = {};
    aircrafts.forEach(a => {
      workload[a.engineerName] = (workload[a.engineerName] || 0) + 1;
    });
    return Object.entries(workload).map(([engineer, count]) => ({
      name: engineer,
      count
    }));
  }, [aircrafts]);

  // Maintenance timeline (by date)
  const timelineData = useMemo(() => {
    const timeline = {};
    aircrafts.forEach(a => {
      const date = a.maintenanceDate.split('T')[0];
      timeline[date] = (timeline[date] || 0) + 1;
    });
    return Object.entries(timeline)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-7)
      .map(([date, count]) => ({
        date,
        count
      }));
  }, [aircrafts]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          📊 Analytics Dashboard
        </Typography>
        <Typography color="text.secondary">
          Insights and metrics of maintenance operations
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Total Aircrafts
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Completion Rate
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'success.main' }}>
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Active Operations
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'primary.main' }}>
                {stats.inProgress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="caption">
                Pending Scheduled
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'warning.main' }}>
                {stats.scheduled}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
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

        {/* Engineer Workload */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Engineer Workload
              </Typography>
              {engineerWorkload.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={engineerWorkload}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={theme.palette.primary.main} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Maintenance Schedule Timeline (Last 7 Days)
              </Typography>
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={theme.palette.primary.main}
                      name="Scheduled Aircrafts"
                      connectNulls
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsPage;
