import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Card,
  Typography,
  Alert
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useAircraft } from '../../../hooks/useAircraft';
import { formatDateShort, getStatusColor, getStatusLabel } from '../../../utils/helpers';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../shared/ConfirmDialog';
import UpdateStatusDialog from '../../shared/forms/UpdateStatusDialog';
import { useNavigate } from 'react-router-dom';

const AircraftListPage = () => {
  const { aircrafts, updateStatus, deleteAircraft, getAircraftHistory } = useAircraft();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Filter aircrafts
  const filteredAircrafts = useMemo(() => {
    return aircrafts.filter(a => {
      const matchesSearch = !searchTerm ||
        a.aircraftId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.engineerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || a.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [aircrafts, searchTerm, statusFilter]);

  const paginatedAircrafts = filteredAircrafts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleUpdateStatus = async (newStatus, engineerName) => {
    try {
      if (!selectedAircraft) return;
      updateStatus(selectedAircraft.id, newStatus, engineerName);
      toast.success(`✅ Status updated to ${newStatus}`);
      setOpenUpdateDialog(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedAircraft) return;
      deleteAircraft(selectedAircraft.id);
      toast.success('✈️ Aircraft deleted successfully');
      setOpenDeleteConfirm(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewHistory = (aircraft) => {
    const history = getAircraftHistory(aircraft.id);
    setHistoryData(history);
    setSelectedAircraft(aircraft);
    setOpenHistoryDialog(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <h2>✈️ Aircraft Management</h2>
          <Button
            variant="contained"
            onClick={() => navigate('/aircrafts/add')}
          >
            ➕ Add Aircraft
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Search by ID, name, or engineer..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
              <TableCell sx={{ fontWeight: 700 }}>Aircraft ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Engineer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Maintenance Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAircrafts.map((aircraft) => (
              <TableRow key={aircraft.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>
                  {aircraft.aircraftId}
                </TableCell>
                <TableCell>{aircraft.name}</TableCell>
                <TableCell>{aircraft.engineerName}</TableCell>
                <TableCell>{formatDateShort(aircraft.maintenanceDate)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusLabel(aircraft.status)}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(aircraft.status),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <IconButton
                    size="small"
                    color="primary"
                    title="View Details"
                    onClick={() => navigate(`/aircrafts/${aircraft.id}`)}
                    sx={{ 
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ViewIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="info"
                    title="Update Status"
                    onClick={() => {
                      setSelectedAircraft(aircraft);
                      setOpenUpdateDialog(true);
                    }}
                    sx={{ 
                      '&:hover': { backgroundColor: 'rgba(3, 155, 229, 0.08)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="success"
                    title="View History"
                    onClick={() => handleViewHistory(aircraft)}
                    sx={{ 
                      '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    title="Delete"
                    onClick={() => {
                      setSelectedAircraft(aircraft);
                      setOpenDeleteConfirm(true);
                    }}
                    sx={{ 
                      '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAircrafts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />

      {/* Dialogs */}
      {selectedAircraft && (
        <>
          <UpdateStatusDialog
            open={openUpdateDialog}
            aircraft={selectedAircraft}
            onClose={() => setOpenUpdateDialog(false)}
            onConfirm={handleUpdateStatus}
          />

          <ConfirmDialog
            open={openDeleteConfirm}
            title="Delete Aircraft"
            message={`Are you sure you want to delete aircraft ${selectedAircraft.aircraftId}?`}
            onConfirm={handleDelete}
            onCancel={() => setOpenDeleteConfirm(false)}
            confirmText="Delete"
            severity="error"
          />

          <Dialog open={openHistoryDialog} onClose={() => setOpenHistoryDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, pb: 2 }}>
              📝 Maintenance History - {selectedAircraft?.aircraftId}
            </DialogTitle>
            <DialogContent>
              {historyData && historyData.length > 0 ? (
                <Timeline position="alternate">
                  {historyData.map((entry, idx) => (
                    <TimelineItem key={idx}>
                      <TimelineSeparator>
                        <TimelineDot
                          sx={{
                            backgroundColor:
                              entry.newStatus === 'SCHEDULED'
                                ? '#FF9800'
                                : entry.newStatus === 'IN_PROGRESS'
                                ? '#2196F3'
                                : '#4CAF50',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {idx + 1}
                        </TimelineDot>
                        {idx < historyData.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: 2, px: 2 }}>
                        <Card sx={{ p: 2, backgroundColor: 'background.paper' }}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            {entry.previousStatus && (
                              <>
                                <Chip
                                  label={entry.previousStatus}
                                  size="small"
                                  variant="outlined"
                                  sx={{ opacity: 0.6 }}
                                />
                                <Typography sx={{ alignSelf: 'center', fontWeight: 600 }}>
                                  →
                                </Typography>
                              </>
                            )}
                            <Chip
                              label={entry.newStatus}
                              size="small"
                              sx={{
                                backgroundColor:
                                  entry.newStatus === 'SCHEDULED'
                                    ? '#FF9800'
                                    : entry.newStatus === 'IN_PROGRESS'
                                    ? '#2196F3'
                                    : '#4CAF50',
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Box>

                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            🕐 {new Date(entry.timestamp).toLocaleString()}
                          </Typography>

                          {entry.engineerName && (
                            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                              👤 <strong>Engineer:</strong> {entry.engineerName}
                            </Typography>
                          )}
                        </Card>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  ℹ️ No maintenance history records found for this aircraft.
                </Alert>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpenHistoryDialog(false)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default AircraftListPage;
