import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from '../utils/db';
import { errorHandler } from '../utils/errorHandler';
import alertRouter from '../controllers/alertController';
import priceRouter from '../controllers/priceController';
import { initializeSockets } from '../sockets/priceSocket';
import {  loginRouter, registerRouter } from '../controllers/authController';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/alerts', alertRouter);
app.use('/api/prices', priceRouter);
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);

// Custom error handling middleware
app.use(errorHandler);


const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});

// Initialize WebSocket connections for real-time price monitoring and alerting
initializeSockets(server);

// Gracefully handle server errors
server.on('error', (error) => {
  console.error('Server encountered an error:', error);
  process.exit(1); // Exit the process with a failure code
});

// Gracefully handle unexpected shutdowns
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  server.close(() => process.exit(1)); // Exit after closing the server
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => process.exit(1)); // Exit after closing the server
});
