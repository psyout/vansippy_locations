import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import locationRoutes from './routes/location.route.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();

// Define the port using an environment variable or default to 8080
const PORT = process.env.PORT || 8080;

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// After all API routes and static middleware
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Route to connect endpoints
app.use('/api/locations', locationRoutes);

// Middleware to Connect to MongoDB
app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at ${PORT}`);
});
