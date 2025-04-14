import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		address: { type: String, required: true },
		coordinates: {
			type: [Number],
			required: true,
			validate: {
				validator: function (arr) {
					return arr.length === 2;
				},
				message: 'Coordinates must be [longitude, latitude]',
			},
		},
		province: String,
		city: String,
		postal_code: String,
		contact_number: String,
		website: String,
		full_address: String,
		neighbourhoods: String,
		category: {
			title: String,
		},
		hours: {
			type: Object,
		},
		drinks: {
			type: Object,
		},
		food: {
			type: Object,
		},
	},

	{
		timestamps: true,
	}
);

const Location = mongoose.model('Location', locationSchema);
export default Location;
