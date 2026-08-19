require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const initSocket = require('./socket/socketHandler');

const authRoutes = require('./routes/authRoutes');
const poleRoutes = require('./routes/poleRoutes');
const sensorRoutes = require('./routes/sensorRoutes');
const faultRoutes = require('./routes/faultRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] }
});

// Make io accessible in controllers via req.app.get('io')
app.set('io', io);
initSocket(io);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'PoleNova AI API', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/poles', poleRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/faults', faultRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`PoleNova AI backend running on port ${PORT}`);
});
