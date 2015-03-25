var mongoose = require('mongoose');

// define the product model (fields and data types)

var CoffeeSchema = new mongoose.Schema({
	title: String,
	description: String,
	location: String,
	coffeetypes: String,
	established: Number,
	fileName: String,
    uploadDate: { type: Date, default: Date.now }
});

//make the model public so other files can access it
module.exports = mongoose.model('Coffee', CoffeeSchema);