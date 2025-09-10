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

// Serve static files from React build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/build')));

// SPA fallback: serve index.html for any unknown route (after API routes)
app.get('/:path*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at ${PORT}`);
});
