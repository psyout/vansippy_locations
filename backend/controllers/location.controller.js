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
	try {
		const location = req.body;

		// Validate required fields
		if (!location.name || !location.address || !location.coordinates) {
			return res.status(400).json({
				success: false,
				message: 'Missing required fields: name, address, and coordinates are required',
			});
		}

		// Validate coordinates format
		if (!Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
			return res.status(400).json({
				success: false,
				message: 'Coordinates must be an array with exactly 2 elements [longitude, latitude]',
			});
		}

		// Transform hours, drinks, and food into Maps (with safe handling)
		const hoursMap = new Map();
		if (location.hours && Array.isArray(location.hours)) {
			location.hours.forEach((hour) => {
				if (hour.days && hour.from && hour.to) {
					hoursMap.set(hour.days, `${hour.from} - ${hour.to}`);
				}
			});
		}

		const drinksMap = new Map();
		if (location.drinks && Array.isArray(location.drinks)) {
			location.drinks.forEach((drink) => {
				if (drink.name && drink.price !== undefined) {
					drinksMap.set(drink.name, drink.price);
				}
			});
		}

		const foodMap = new Map();
		if (location.food && Array.isArray(location.food)) {
			location.food.forEach((item) => {
				if (item.name && item.price !== undefined) {
					foodMap.set(item.name, item.price);
				}
			});
		}

		const newLocation = new Location({
			...location,
			hours: hoursMap,
			drinks: drinksMap,
			food: foodMap,
		});

		await newLocation.save();
		res.status(201).json({ success: true, data: newLocation });
	} catch (error) {
		console.error('Error saving location:', error.message);

		// Handle specific Mongoose validation errors
		if (error.name === 'ValidationError') {
			const validationErrors = Object.values(error.errors).map((err) => err.message);
			return res.status(400).json({
				success: false,
				message: 'Validation error',
				errors: validationErrors,
			});
		}

		res.status(500).json({ success: false, message: 'Server error' });
	}
};

export const updateLocation = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: 'Invalid ID format' });
	}

	try {
		const updatedLocation = await Location.findByIdAndUpdate(id, req.body, {
			new: true, // return updated document
			runValidators: true, // enforce schema validation on update
		});

		if (!updatedLocation) {
			return res.status(404).json({ success: false, message: 'Location not found' });
		}

		res.status(200).json({ success: true, data: updatedLocation });
	} catch (error) {
		console.error('Error updating location:', error.message);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};

export const deleteLocation = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: 'Invalid ID format' });
	}

	try {
		await Location.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: 'Location deleted' });
	} catch (error) {
		console.error('Error deleting location:', error.message);
		res.status(500).json({ success: false, message: 'Server Error' });
	}
};
