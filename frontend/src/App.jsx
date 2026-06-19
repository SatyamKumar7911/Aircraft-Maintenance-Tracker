import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/shared/layouts/Sidebar';
import Header from './components/shared/layouts/Header';
import Footer from './components/shared/layouts/Footer';
import DashboardPage from './components/pages/dashboard/DashboardPage';
import AircraftListPage from './components/pages/aircraft/AircraftListPage';
import AircraftDetailPage from './components/pages/aircraft/AircraftDetailPage';
import AddAircraftPage from './components/pages/aircraft/AddAircraftPage';
import ActiveMaintenancePage from './components/pages/aircraft/ActiveMaintenancePage';
import TodaySchedulePage from './components/pages/aircraft/TodaySchedulePage';
import HistoryPage from './components/pages/history/HistoryPage';
import AnalyticsPage from './components/pages/analytics/AnalyticsPage';
import NotFound from './components/pages/NotFound';

import { AircraftProvider } from './context/AircraftContext';
import { AppThemeProvider } from './context/ThemeContext';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuOpen={() => setSidebarOpen(true)} />

        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: 'background.default'
          }}
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/aircrafts" element={<AircraftListPage />} />
            <Route path="/aircrafts/add" element={<AddAircraftPage />} />
            <Route path="/aircrafts/active" element={<ActiveMaintenancePage />} />
            <Route path="/aircrafts/today" element={<TodaySchedulePage />} />
            <Route path="/aircrafts/:id" element={<AircraftDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

function App() {
  return (
    <AppThemeProvider>
      <AircraftProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </AircraftProvider>
    </AppThemeProvider>
  );
}

export default App;
