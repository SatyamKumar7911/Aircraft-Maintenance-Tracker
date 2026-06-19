import React, { createContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AircraftContext = createContext();

export const AircraftProvider = ({ children }) => {
  const [aircrafts, setAircrafts] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedAircrafts = localStorage.getItem('aircrafts');
    const savedActivityLog = localStorage.getItem('activityLog');
    
    if (savedAircrafts) {
      try {
        setAircrafts(JSON.parse(savedAircrafts));
      } catch (err) {
        console.error('Error loading aircrafts from localStorage:', err);
      }
    }
    
    if (savedActivityLog) {
      try {
        setActivityLog(JSON.parse(savedActivityLog));
      } catch (err) {
        console.error('Error loading activity log from localStorage:', err);
      }
    }
  }, []);

  // Save to localStorage whenever aircrafts change
  useEffect(() => {
    localStorage.setItem('aircrafts', JSON.stringify(aircrafts));
  }, [aircrafts]);

  useEffect(() => {
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
  }, [activityLog]);

  const addAircraft = useCallback((aircraft) => {
    const newAircraft = {
      id: uuidv4(),
      ...aircraft,
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          previousStatus: null,
          newStatus: 'SCHEDULED',
          timestamp: new Date().toISOString(),
          engineerName: null
        }
      ]
    };

    setAircrafts(prev => [...prev, newAircraft]);
    addActivity(`Aircraft ${aircraft.aircraftId} registered`);
    return newAircraft;
  }, []);

  const updateAircraft = useCallback((id, updates) => {
    setAircrafts(prev =>
      prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a)
    );
  }, []);

  const updateStatus = useCallback((id, newStatus, engineerName) => {
    setAircrafts(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updatedAircraft = {
            ...a,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            history: [
              ...a.history,
              {
                previousStatus: a.status,
                newStatus: newStatus,
                timestamp: new Date().toISOString(),
                engineerName: engineerName || a.engineerName
              }
            ]
          };
          addActivity(`Aircraft ${a.aircraftId} moved to ${newStatus}`);
          return updatedAircraft;
        }
        return a;
      })
    );
  }, []);

  const deleteAircraft = useCallback((id) => {
    const aircraft = aircrafts.find(a => a.id === id);
    if (aircraft) {
      setAircrafts(prev => prev.filter(a => a.id !== id));
      addActivity(`Aircraft ${aircraft.aircraftId} deleted`);
    }
  }, [aircrafts]);

  const getAircraftHistory = useCallback((id) => {
    const aircraft = aircrafts.find(a => a.id === id);
    return aircraft ? aircraft.history : [];
  }, [aircrafts]);

  const getActiveAircrafts = useCallback(() => {
    return aircrafts.filter(a => a.status === 'IN_PROGRESS');
  }, [aircrafts]);

  const getTodayAircrafts = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return aircrafts.filter(a => a.maintenanceDate.startsWith(today));
  }, [aircrafts]);

  const getStatistics = useCallback(() => {
    return {
      total: aircrafts.length,
      scheduled: aircrafts.filter(a => a.status === 'SCHEDULED').length,
      inProgress: aircrafts.filter(a => a.status === 'IN_PROGRESS').length,
      completed: aircrafts.filter(a => a.status === 'COMPLETED').length
    };
  }, [aircrafts]);

  const addActivity = useCallback((message) => {
    const activity = {
      id: uuidv4(),
      message,
      timestamp: new Date().toISOString()
    };
    setActivityLog(prev => [activity, ...prev].slice(0, 50)); // Keep last 50 activities
  }, []);

  const value = {
    aircrafts,
    activityLog,
    loading,
    error,
    addAircraft,
    updateAircraft,
    updateStatus,
    deleteAircraft,
    getAircraftHistory,
    getActiveAircrafts,
    getTodayAircrafts,
    getStatistics,
    addActivity
  };

  return (
    <AircraftContext.Provider value={value}>
      {children}
    </AircraftContext.Provider>
  );
};
