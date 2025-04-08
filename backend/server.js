import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import locationRoutes from './routes/location.route.js';

dotenv.config();

const app = express();

// Define the port using an environment variable or default to 5000
const PORT = process.env.PORT || 6000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to connect endpoints
app.use('/api/locations', locationRoutes);

// Middleware to Connect to MongoDB
app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at http://localhost:${PORT}`);
});
