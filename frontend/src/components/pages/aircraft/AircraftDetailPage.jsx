import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAircraft } from '../../../hooks/useAircraft';
import { formatDate, getStatusColor, getStatusLabel } from '../../../utils/helpers';
import toast from 'react-hot-toast';
import UpdateStatusDialog from '../../shared/forms/UpdateStatusDialog';
import ConfirmDialog from '../../shared/ConfirmDialog';

const AircraftDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { aircrafts, updateStatus, deleteAircraft, getAircraftHistory } = useAircraft();
  
  const aircraft = aircrafts.find(a => a.id === id);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [history, setHistory] = useState([]);

  if (!aircraft) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Aircraft Not Found
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            The aircraft with ID "{id}" could not be found.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/aircrafts')}
          >
            Back to Aircraft List
          </Button>
        </Paper>
      </Container>
    );
  }

  const handleViewHistory = () => {
    const aircraftHistory = getAircraftHistory(id);
    setHistory(aircraftHistory);
    setOpenHistoryDialog(true);
  };

  const handleUpdateStatus = async (newStatus, notes) => {
    try {
      await updateStatus(id, newStatus, notes);
      setOpenUpdateDialog(false);
      toast.success('Aircraft status updated successfully');
    } catch (error) {
      toast.error('Failed to update aircraft status');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAircraft(id);
      setOpenDeleteDialog(false);
      toast.success('Aircraft deleted successfully');
      navigate('/aircrafts');
    } catch (error) {
      toast.error('Failed to delete aircraft');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton
          onClick={() => navigate('/aircrafts')}
          size="large"
          sx={{ color: 'primary.main' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flex: 1 }}>
          Aircraft Details
        </Typography>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={handleViewHistory}
          size="small"
        >
          History
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => setOpenUpdateDialog(true)}
          size="small"
        >
          Update
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDeleteDialog(true)}
          size="small"
        >
          Delete
        </Button>
      </Box>

      {/* Aircraft Information */}
      <Grid container spacing={3}>
        {/* Main Information Card */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary" variant="caption">
                    Aircraft ID
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {aircraft.aircraftId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary" variant="caption">
                    Aircraft Name
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {aircraft.name}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary" variant="caption">
                    Engineer Name
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {aircraft.engineerName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary" variant="caption">
                    Maintenance Date
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 0.5 }}>
                    {formatDate(aircraft.maintenanceDate)}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography color="textSecondary" variant="caption">
                    Current Status
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={getStatusLabel(aircraft.status)}
                      color="primary"
                      variant="filled"
                      sx={{
                        backgroundColor: getStatusColor(aircraft.status),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Grid>

                {aircraft.notes && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography color="textSecondary" variant="caption">
                      Notes
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {aircraft.notes}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary" variant="caption">
                    Created At
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {aircraft.createdAt ? formatDate(aircraft.createdAt) : 'N/A'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography color="textSecondary" variant="caption">
                    Last Updated
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {aircraft.updatedAt ? formatDate(aircraft.updatedAt) : 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Update Status Dialog */}
      <UpdateStatusDialog
        open={openUpdateDialog}
        aircraft={aircraft}
        onClose={() => setOpenUpdateDialog(false)}
        onConfirm={handleUpdateStatus}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteDialog}
        title="Delete Aircraft"
        message={`Are you sure you want to delete aircraft "${aircraft.aircraftId}"? This action cannot be undone.`}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDelete}
        isDestructive
      />

      {/* History Dialog */}
      <Dialog
        open={openHistoryDialog}
        onClose={() => setOpenHistoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Maintenance History - {aircraft.aircraftId}</DialogTitle>
        <DialogContent>
          {history.length === 0 ? (
            <Typography color="textSecondary" sx={{ py: 2 }}>
              No history available
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
              {history.map((entry, idx) => (
                <Paper key={idx} sx={{ p: 2, backgroundColor: 'background.default' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(entry.date)}
                      </Typography>
                      <Chip
                        label={entry.status}
                        size="small"
                        sx={{
                          mt: 1,
                          backgroundColor: getStatusColor(entry.status),
                          color: 'white'
                        }}
                      />
                    </Box>
                    {entry.engineer && (
                      <Typography variant="caption" color="textSecondary">
                        by {entry.engineer}
                      </Typography>
                    )}
                  </Box>
                  {entry.notes && (
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                      {entry.notes}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AircraftDetailPage;
