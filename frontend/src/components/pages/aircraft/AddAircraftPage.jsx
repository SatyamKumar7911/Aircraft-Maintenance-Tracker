import React from 'react';
import { Container, Box } from '@mui/material';
import AddAircraftForm from '../../shared/forms/AddAircraftForm';

const AddAircraftPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <AddAircraftForm />
    </Container>
  );
};

export default AddAircraftPage;
