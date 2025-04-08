import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Location from './models/locations.model.js';

dotenv.config();

const app = express();

// Define the port using an environment variable or default to 5000
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies
app.post('/api/locations', async (req, res) => {
	const location = req.body;

	// Validate required fields
	if (!location.name || !location.address || !location.category?.title) {
		return res.status(400).json({ success: false, message: 'Missing required fields' });
	}

	const newLocation = new Location(location);
	try {
		await newLocation.save();
		res.status(201).json({ success: true, data: newLocation });
	} catch (error) {
		console.error('Error saving location:', error.message);
		res.status(500).json({ success: false, message: 'Server error' });
	}
});

app.listen(PORT, () => {
	// Connect to MongoDB
	connectDB();
	console.log(`Server started at http://localhost:${PORT}`);
});
