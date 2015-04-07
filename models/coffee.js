var mongoose = require('mongoose');

// define the product model (fields and data types)

var CoffeeSchema = new mongoose.Schema({
	title: String,
	description: String,
	location: String,
	coffeetypes: String,
	coffeetype2: String,
	coffeetype3: String,
	established: Number,
	weekAm: String,
	weekPm: String,
	satAm: String,
	satPm: String,
	sunAm: String,
	sunPm: String,
	email: String,
	phone: Number,
	fileName: String,
    uploadDate: { type: Date, default: Date.now }
});

//make the model public so other files can access it
module.exports = mongoose.model('Coffee', CoffeeSchema);
