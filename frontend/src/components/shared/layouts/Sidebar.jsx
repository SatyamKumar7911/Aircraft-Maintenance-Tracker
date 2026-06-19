import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Switch,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  AirplanemodeActive as AircraftIcon,
  Add as AddIcon,
  Construction as MaintenanceIcon,
  Today as TodayIcon,
  History as HistoryIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';

const DRAWER_WIDTH = 280;

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Aircrafts', icon: <AircraftIcon />, path: '/aircrafts' },
    { label: 'Add Aircraft', icon: <AddIcon />, path: '/aircrafts/add' },
    { label: 'Active Maintenance', icon: <MaintenanceIcon />, path: '/aircrafts/active' },
    { label: "Today's Schedule", icon: <TodayIcon />, path: '/aircrafts/today' },
    { label: 'History', icon: <HistoryIcon />, path: '/history' },
    { label: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' }
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const drawerContent = (
    <Box>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          color: 'white'
        }}
      >
        <AircraftIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Aircraft
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Maintenance Tracker
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.path}
            button
            onClick={() => handleNavigate(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 1.5,
              mb: 1,
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white'
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 500 }}
            />
          </ListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1.5,
            borderRadius: 1,
            backgroundColor: 'rgba(25, 118, 210, 0.08)'
          }}
        >
          {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
          <Switch
            size="small"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          height: '100vh',
          overflow: 'auto',
          position: 'sticky',
          top: 0
        }}
      >
        {drawerContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', md: 'none' }
        }}
      >
        <Box sx={{ width: DRAWER_WIDTH }}>
          {drawerContent}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
