import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import locationRoutes from './routes/location.route.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/locations', locationRoutes);

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Catch-all route for React Router (must be last)
app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at ${PORT}`);
});
