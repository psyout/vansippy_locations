import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import locationRoutes from './routes/location.route.js';
import cors from 'cors';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

// Allow CORS for the Render URL
app.use(
	cors({
		origin: [
			'http://localhost:3001', // Local development frontend
			'https://vansippy-locations.onrender.com', // Deployed frontend
		],
	})
);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to connect endpoints
app.use('/api/locations', locationRoutes);

// Middleware to Connect to MongoDB
app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at ${PORT}`);
});
