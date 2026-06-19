import { v4 as uuidv4 } from 'uuid';

export class Aircraft {
  constructor(data) {
    this.aircraftId = data.aircraftId;
    this.name = data.name;
    this.status = data.status || 'SCHEDULED';
    this.maintenanceDate = data.maintenanceDate;
    this.engineerName = data.engineerName;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.history = data.history || [
      {
        previousStatus: null,
        newStatus: 'SCHEDULED',
        timestamp: new Date().toISOString(),
        engineerName: null
      }
    ];
  }

  static validateAircraft(data) {
    const errors = [];

    if (!data.aircraftId || !data.aircraftId.trim()) {
      errors.push('Aircraft ID is required');
    }

    if (!data.name || !data.name.trim()) {
      errors.push('Aircraft name is required');
    }

    if (!data.maintenanceDate) {
      errors.push('Maintenance date is required');
    } else {
      const date = new Date(data.maintenanceDate);
      if (isNaN(date.getTime())) {
        errors.push('Invalid maintenance date format');
      }
    }

    if (!data.engineerName || !data.engineerName.trim()) {
      errors.push('Engineer name is required');
    }

    return errors;
  }

  static isValidTransition(currentStatus, newStatus) {
    const validTransitions = {
      'SCHEDULED': ['IN_PROGRESS'],
      'IN_PROGRESS': ['COMPLETED'],
      'COMPLETED': []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  updateStatus(newStatus, engineerName) {
    if (!Aircraft.isValidTransition(this.status, newStatus)) {
      throw new Error(
        `Invalid status transition from ${this.status} to ${newStatus}`
      );
    }

    this.history.push({
      previousStatus: this.status,
      newStatus: newStatus,
      timestamp: new Date().toISOString(),
      engineerName: engineerName || this.engineerName
    });

    this.status = newStatus;
    this.updatedAt = new Date().toISOString();
  }
}

export class AircraftStore {
  constructor() {
    this.aircrafts = new Map();
    this.history = [];
  }

  addAircraft(aircraft) {
    if (this.aircrafts.has(aircraft.aircraftId)) {
      throw new Error(`Aircraft with ID ${aircraft.aircraftId} already exists`);
    }
    this.aircrafts.set(aircraft.aircraftId, aircraft);
    return aircraft;
  }

  getAircraft(aircraftId) {
    const aircraft = this.aircrafts.get(aircraftId);
    if (!aircraft) {
      throw new Error(`Aircraft with ID ${aircraftId} not found`);
    }
    return aircraft;
  }

  getAllAircrafts() {
    return Array.from(this.aircrafts.values());
  }

  updateAircraftStatus(aircraftId, newStatus, engineerName) {
    const aircraft = this.getAircraft(aircraftId);
    aircraft.updateStatus(newStatus, engineerName);
    return aircraft;
  }

  getActiveAircrafts() {
    return this.getAllAircrafts().filter(a => a.status === 'IN_PROGRESS');
  }

  getTodayAircrafts() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAllAircrafts().filter(a => 
      a.maintenanceDate.startsWith(today)
    );
  }

  getAircraftHistory(aircraftId) {
    const aircraft = this.getAircraft(aircraftId);
    return aircraft.history;
  }

  deleteAircraft(aircraftId) {
    const aircraft = this.getAircraft(aircraftId);
    this.aircrafts.delete(aircraftId);
    return aircraft;
  }

  getStatistics() {
    const aircrafts = this.getAllAircrafts();
    return {
      total: aircrafts.length,
      scheduled: aircrafts.filter(a => a.status === 'SCHEDULED').length,
      inProgress: aircrafts.filter(a => a.status === 'IN_PROGRESS').length,
      completed: aircrafts.filter(a => a.status === 'COMPLETED').length
    };
  }
}

// Singleton instance
export const store = new AircraftStore();

// Mock data
export function initializeMockData() {
  const mockAircrafts = [
    {
      aircraftId: 'AI101',
      name: 'Boeing 737-800',
      engineerName: 'John Smith',
      maintenanceDate: new Date().toISOString().split('T')[0],
      status: 'SCHEDULED'
    },
    {
      aircraftId: 'AI102',
      name: 'Airbus A320',
      engineerName: 'Sarah Johnson',
      maintenanceDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'IN_PROGRESS'
    },
    {
      aircraftId: 'AI103',
      name: 'Bombardier CRJ900',
      engineerName: 'Mike Davis',
      maintenanceDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      status: 'COMPLETED'
    }
  ];

  mockAircrafts.forEach(data => {
    const aircraft = new Aircraft(data);
    if (data.status === 'IN_PROGRESS') {
      aircraft.updateStatus('IN_PROGRESS', data.engineerName);
    } else if (data.status === 'COMPLETED') {
      aircraft.updateStatus('IN_PROGRESS', data.engineerName);
      aircraft.updateStatus('COMPLETED', data.engineerName);
    }
    store.addAircraft(aircraft);
  });
}
