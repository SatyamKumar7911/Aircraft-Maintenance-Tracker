import { useContext } from 'react';
import { AircraftContext } from '../context/AircraftContext';

export const useAircraft = () => {
  const context = useContext(AircraftContext);
  if (!context) {
    throw new Error('useAircraft must be used within AircraftProvider');
  }
  return context;
};
