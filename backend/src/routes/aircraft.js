import express from 'express';
import { Aircraft, store, initializeMockData } from '../models/Aircraft.js';

const router = express.Router();

// Initialize mock data on first request
let initialized = false;
router.use((req, res, next) => {
  if (!initialized) {
    initializeMockData();
    initialized = true;
  }
  next();
});

// GET all aircrafts
router.get('/', (req, res) => {
  try {
    const aircrafts = store.getAllAircrafts();
    res.status(200).json({
      success: true,
      data: aircrafts,
      count: aircrafts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET aircraft by ID
router.get('/:id', (req, res) => {
  try {
    const aircraft = store.getAircraft(req.params.id);
    res.status(200).json({
      success: true,
      data: aircraft
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// POST new aircraft
router.post('/', (req, res) => {
  try {
    const { aircraftId, name, maintenanceDate, engineerName } = req.body;

    const errors = Aircraft.validateAircraft({
      aircraftId,
      name,
      maintenanceDate,
      engineerName
    });

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    const aircraft = new Aircraft({
      aircraftId,
      name,
      maintenanceDate,
      engineerName,
      status: 'SCHEDULED'
    });

    const added = store.addAircraft(aircraft);

    res.status(201).json({
      success: true,
      message: 'Aircraft registered successfully',
      data: added
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update aircraft status
router.put('/:id/status', (req, res) => {
  try {
    const { newStatus, engineerName } = req.body;

    if (!newStatus) {
      return res.status(400).json({ error: 'New status is required' });
    }

    const aircraft = store.updateAircraftStatus(
      req.params.id,
      newStatus,
      engineerName
    );

    res.status(200).json({
      success: true,
      message: `Status updated to ${newStatus}`,
      data: aircraft
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET active aircrafts (in maintenance)
router.get('/active/list', (req, res) => {
  try {
    const activeAircrafts = store.getActiveAircrafts();
    res.status(200).json({
      success: true,
      data: activeAircrafts,
      count: activeAircrafts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET today's scheduled aircrafts
router.get('/schedule/today', (req, res) => {
  try {
    const todayAircrafts = store.getTodayAircrafts();
    res.status(200).json({
      success: true,
      data: todayAircrafts,
      count: todayAircrafts.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET aircraft maintenance history
router.get('/:id/history', (req, res) => {
  try {
    const history = store.getAircraftHistory(req.params.id);
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// GET statistics
router.get('/stats/overview', (req, res) => {
  try {
    const stats = store.getStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE aircraft
router.delete('/:id', (req, res) => {
  try {
    const aircraft = store.deleteAircraft(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Aircraft deleted successfully',
      data: aircraft
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;
