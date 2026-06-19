import React from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAircraft } from '../../../hooks/useAircraft';
import { validateDate } from '../../../utils/helpers';

const AddAircraftForm = () => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      aircraftId: '',
      name: '',
      engineerName: '',
      maintenanceDate: new Date().toISOString().split('T')[0]
    }
  });

  const navigate = useNavigate();
  const { addAircraft, aircrafts } = useAircraft();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Validation
      if (!data.aircraftId.trim()) {
        toast.error('Aircraft ID is required');
        return;
      }

      if (!data.name.trim()) {
        toast.error('Aircraft name is required');
        return;
      }

      if (!data.engineerName.trim()) {
        toast.error('Engineer name is required');
        return;
      }

      // Check for duplicate aircraft ID
      if (aircrafts.some(a => a.aircraftId === data.aircraftId)) {
        toast.error(`Aircraft with ID "${data.aircraftId}" already exists`);
        return;
      }

      // Validate date
      if (!validateDate(data.maintenanceDate)) {
        toast.error('Invalid maintenance date');
        return;
      }

      const newAircraft = addAircraft({
        aircraftId: data.aircraftId,
        name: data.name,
        engineerName: data.engineerName,
        maintenanceDate: data.maintenanceDate
      });

      toast.success('✈️ Aircraft registered successfully!');
      reset();
      setTimeout(() => navigate('/aircrafts'), 1000);
    } catch (error) {
      toast.error(error.message || 'Failed to add aircraft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          ➕ Register New Aircraft
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="aircraftId"
                control={control}
                rules={{
                  required: 'Aircraft ID is required',
                  pattern: {
                    value: /^[A-Z]{2}\d{3,}$/,
                    message: 'Format: AI101, BA200, etc.'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Aircraft ID"
                    placeholder="e.g., AI101"
                    error={!!errors.aircraftId}
                    helperText={errors.aircraftId?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="maintenanceDate"
                control={control}
                rules={{ required: 'Maintenance date is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Maintenance Date"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.maintenanceDate}
                    helperText={errors.maintenanceDate?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Aircraft name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Aircraft Name"
                    placeholder="e.g., Boeing 737-800"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="engineerName"
                control={control}
                rules={{ required: 'Engineer name is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Engineer Name"
                    placeholder="e.g., John Smith"
                    error={!!errors.engineerName}
                    helperText={errors.engineerName?.message}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="info">
                Default status will be set to <strong>SCHEDULED</strong>
              </Alert>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/aircrafts')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Register Aircraft'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAircraftForm;
