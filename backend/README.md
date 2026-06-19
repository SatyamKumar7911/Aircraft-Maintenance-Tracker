# Aircraft Maintenance Tracker - Backend API

RESTful API for tracking aircraft maintenance operations in real-time.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production

```bash
npm start
```

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Health check endpoint

### Aircraft Operations

#### Get All Aircrafts
```
GET /api/aircrafts
```

#### Get Aircraft by ID
```
GET /api/aircrafts/:id
```

#### Register New Aircraft
```
POST /api/aircrafts
Content-Type: application/json

{
  "aircraftId": "AI101",
  "name": "Boeing 737-800",
  "maintenanceDate": "2024-01-15",
  "engineerName": "John Smith"
}
```

#### Update Aircraft Status
```
PUT /api/aircrafts/:id/status
Content-Type: application/json

{
  "newStatus": "IN_PROGRESS",
  "engineerName": "John Smith"
}
```

Valid transitions:
- `SCHEDULED` → `IN_PROGRESS`
- `IN_PROGRESS` → `COMPLETED`

#### Get Active Aircrafts (In Maintenance)
```
GET /api/aircrafts/active/list
```

#### Get Today's Schedule
```
GET /api/aircrafts/schedule/today
```

#### Get Aircraft History
```
GET /api/aircrafts/:id/history
```

#### Get Statistics
```
GET /api/aircrafts/stats/overview
```

#### Delete Aircraft
```
DELETE /api/aircrafts/:id
```

## 📊 Data Model

```javascript
{
  aircraftId: string,      // Unique identifier
  name: string,            // Aircraft name
  status: string,          // SCHEDULED | IN_PROGRESS | COMPLETED
  maintenanceDate: string, // ISO date format
  engineerName: string,    // Assigned engineer
  createdAt: string,       // Creation timestamp
  updatedAt: string,       // Last update timestamp
  history: Array          // Status change history
}
```

## ✅ Features

- ✈️ Aircraft registration with unique IDs
- 🔄 Status management with validation
- 📝 Full maintenance history tracking
- 🎯 Filter active and scheduled aircrafts
- 📊 Statistics and analytics endpoints
- 🛡️ Error handling and validation
- 🌐 CORS enabled for frontend integration

## 🏗️ Architecture

- **Express.js** - Web framework
- **UUID** - Unique identifier generation
- **CORS** - Cross-origin resource sharing
- **In-memory Storage** - Current data persistence

## 📦 Dependencies

- `express` - Web server framework
- `cors` - Cross-origin request handling
- `uuid` - ID generation
