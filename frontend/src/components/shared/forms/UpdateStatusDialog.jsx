import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';

const UpdateStatusDialog = ({
  open,
  aircraft,
  onClose,
  onConfirm
}) => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      engineerName: aircraft?.engineerName || ''
    }
  });

  const getNextStatus = () => {
    if (aircraft?.status === 'SCHEDULED') return 'IN_PROGRESS';
    if (aircraft?.status === 'IN_PROGRESS') return 'COMPLETED';
    return null;
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const nextStatus = getNextStatus();

      if (!nextStatus) {
        toast.error('This aircraft cannot be updated further');
        return;
      }

      await onConfirm(nextStatus, data.engineerName);
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const nextStatus = getNextStatus();
  const canUpdate = !!nextStatus;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        🔄 Update Maintenance Status
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {!canUpdate && (
            <Alert severity="info">
              Aircraft is already completed. No further updates available.
            </Alert>
          )}

          {canUpdate && (
            <>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Aircraft: <strong>{aircraft?.aircraftId}</strong>
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Status: <strong>{aircraft?.status}</strong>
                </Typography>
                <Typography variant="subtitle2" color="success.main" sx={{ mt: 1 }}>
                  New Status: <strong>{nextStatus}</strong>
                </Typography>
              </Box>

              <Alert severity="warning">
                {aircraft?.status === 'SCHEDULED' &&
                  'Aircraft will move to IN_PROGRESS status'}
                {aircraft?.status === 'IN_PROGRESS' &&
                  'Aircraft maintenance will be marked as COMPLETED'}
              </Alert>

              <Controller
                name="engineerName"
                control={control}
                rules={{ required: 'Engineer name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Engineer Name"
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                    disabled={loading}
                  />
                )}
              />
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        {canUpdate && (
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusDialog;
