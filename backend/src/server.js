import express from 'express';
import cors from 'cors';
import aircraftRoutes from './routes/aircraft.js';
import errorMiddleware from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/aircrafts', aircraftRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✈️  Aircraft Maintenance Tracker API running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
