import axios from 'axios';
import Location from '../models/locations.model.js'; // Import the Location model

export const getGooglePhoto = async (req, res) => {
	const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
	const businessName = req.query.name;

	if (!businessName) {
		return res.status(400).json({ success: false, message: 'Missing business name' });
	}

	try {
		// Step 1: Fetch the business from MongoDB using partial matching
		const business = await Location.findOne({
			name: { $regex: businessName, $options: 'i' }, // Case-insensitive partial match
		});
		if (!business) {
			return res.status(404).json({ success: false, message: 'Business not found in MongoDB' });
		}

		// Step 2: Get place_id from Google Places API
		const findPlaceRes = await axios.get('https://maps.googleapis.com/maps/api/place/findplacefromtext/json', {
			params: {
				input: `${businessName}, Vancouver`, // Append city if needed
				inputtype: 'textquery',
				fields: 'place_id',
				key: GOOGLE_API_KEY,
			},
		});

		const placeId = findPlaceRes.data?.candidates?.[0]?.place_id;
		if (!placeId) {
			return res.status(404).json({ success: false, message: 'Place not found on Google Maps' });
		}

		// Step 3: Get photo_reference from Google Places Details API
		const detailsRes = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
			params: {
				place_id: placeId,
				fields: 'photos',
				key: GOOGLE_API_KEY,
			},
		});

		const photoRef = detailsRes.data?.result?.photos?.[0]?.photo_reference;
		if (!photoRef) {
			return res.status(404).json({ success: false, message: 'Photo not found on Google Maps' });
		}

		// Step 4: Construct the photo URL
		const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;

		// Step 5: Return the photo URL to the frontend
		return res.status(200).json({ success: true, photoUrl });
	} catch (error) {
		console.error('Error fetching Google Maps photo:', error.message);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};
