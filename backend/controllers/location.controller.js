import mongoose from 'mongoose';
import Location from '../models/locations.model.js';

export const getLocations = async (req, res) => {
	try {
		const locations = await Location.find({});
		res.status(200).json({ success: true, data: locations });
	} catch (error) {
		console.error('Error fetching locations:', error.message);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};

export const addLocation = async (req, res) => {
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
};

export const updateLocation = async (req, res) => {
	const { id } = req.params;

	const location = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ success: false, message: 'Invalid ID format' });
	}

	try {
		await Location.findByIdAndUpdate(id, location, { new: true });
		res.status(200).json({ success: true, data: location });
	} catch (error) {
		res.status(500).json({ success: false, message: 'Server error' });
		console.error('Error updating location:', error.message);
	}
};

export const deleteLocation = async (req, res) => {
	const { id } = req.params;

	try {
		await Location.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: 'Location deleted' });
	} catch (error) {
		console.error('Error deleting location:', error.message);
		res.status(404).json({ success: false, message: 'Location not found' });
	}
};
