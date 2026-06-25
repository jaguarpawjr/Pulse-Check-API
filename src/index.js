const express = require('express');
const monitorController = require('./controllers/monitorController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Basic request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.post('/monitors', monitorController.register);
app.post('/monitors/:id/heartbeat', monitorController.heartbeat);
app.post('/monitors/:id/pause', monitorController.pause);

// Developer's Choice Routes
app.get('/monitors', monitorController.getAll);
app.get('/monitors/:id', monitorController.getOne);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Pulse-Check-API server listening on port ${PORT}`);
});
