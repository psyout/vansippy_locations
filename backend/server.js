import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import locationRoutes from './routes/location.route.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Define the port using an environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use('/api/locations', locationRoutes);

// Serve React app in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
	// Serve static files from the React app's build folder
	app.use(express.static(path.join(__dirname, '../client/build')));

	// Catch-all route to serve React's index.html for unknown routes
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
	});
}

// Middleware to connect to MongoDB and start the server
app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at ${PORT}`);
});
