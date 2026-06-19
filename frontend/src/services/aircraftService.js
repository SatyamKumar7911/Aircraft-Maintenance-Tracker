import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simulate network delay for demo purposes
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const aircraftService = {
  // Get all aircrafts
  getAllAircrafts: async () => {
    try {
      const response = await apiClient.get('/aircrafts');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching aircrafts:', error);
      throw error;
    }
  },

  // Get aircraft by ID
  getAircraftById: async (id) => {
    try {
      const response = await apiClient.get(`/aircrafts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching aircraft:', error);
      throw error;
    }
  },

  // Add new aircraft
  addAircraft: async (aircraftData) => {
    try {
      await delay(500); // Simulate API call
      const response = await apiClient.post('/aircrafts', aircraftData);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.details?.[0] || 'Validation failed');
      }
      throw error;
    }
  },

  // Update aircraft status
  updateStatus: async (id, newStatus, engineerName) => {
    try {
      const response = await apiClient.put(`/aircrafts/${id}/status`, {
        newStatus,
        engineerName
      });
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data.error || 'Invalid status transition');
      }
      throw error;
    }
  },

  // Get active aircrafts
  getActiveAircrafts: async () => {
    try {
      const response = await apiClient.get('/aircrafts/active/list');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching active aircrafts:', error);
      throw error;
    }
  },

  // Get today's aircrafts
  getTodayAircrafts: async () => {
    try {
      const response = await apiClient.get('/aircrafts/schedule/today');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching today aircrafts:', error);
      throw error;
    }
  },

  // Get aircraft history
  getAircraftHistory: async (id) => {
    try {
      const response = await apiClient.get(`/aircrafts/${id}/history`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching aircraft history:', error);
      throw error;
    }
  },

  // Get statistics
  getStatistics: async () => {
    try {
      const response = await apiClient.get('/aircrafts/stats/overview');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Delete aircraft
  deleteAircraft: async (id) => {
    try {
      const response = await apiClient.delete(`/aircrafts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting aircraft:', error);
      throw error;
    }
  }
};
