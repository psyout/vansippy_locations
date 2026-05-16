import express from 'express';

import { addLocation, deleteLocation, getLocations, updateLocation } from '../controllers/location.controller.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Router to get all locations
router.get('/', getLocations);

// Router to Add Location
router.post('/', requireAuth, addLocation);

// Router to Update Location
router.put('/:id', requireAuth, updateLocation);

// Router to Delete Location
router.delete('/:id', requireAuth, deleteLocation);

export default router;
