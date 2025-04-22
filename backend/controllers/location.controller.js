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

	// Transform hours, drinks, and food into Maps
	const hoursMap = new Map();
	location.hours.forEach((hour) => {
		hoursMap.set(hour.days, `${hour.from} - ${hour.to}`);
	});

	const drinksMap = new Map();
	location.drinks.forEach((drink) => {
		drinksMap.set(drink.name, drink.price);
	});

	const foodMap = new Map();
	location.food.forEach((item) => {
		foodMap.set(item.name, item.price);
	});

	const newLocation = new Location({
		...location,
		hours: hoursMap,
		drinks: drinksMap,
		food: foodMap,
	});

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
		return res.status(404).json({ success: false, message: 'Invalid ID format' });
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
