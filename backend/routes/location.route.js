import express from 'express';

import {
	addLocation,
	deleteLocation,
	getLocations,
	updateLocation,
} from '../controllers/location.controller.js';

const router = express.Router();

// Router to get all locations
router.get('/', getLocations);

// Router to Add Location
router.post('/', addLocation);

// Router to Update Location
router.put('/:id', updateLocation);

// Router to Delete Location
router.delete('/:id', deleteLocation);

export default router;
