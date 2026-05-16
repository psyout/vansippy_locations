import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import locationRoutes from './routes/location.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

// Define the port using an environment variable or default to 8080
const PORT = process.env.PORT || 8080;

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) return callback(null, true);
			if (corsOrigins.includes(origin)) return callback(null, true);
			return callback(new Error(`CORS blocked for origin: ${origin}`));
		},
		credentials: true,
	}),
);

app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// Route to connect endpoints
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
	res.status(200).json({ ok: true });
});

// Middleware to Connect to MongoDB
app.listen(PORT, () => {
	connectDB();
	console.log(`Server started at ${PORT}`);
});
