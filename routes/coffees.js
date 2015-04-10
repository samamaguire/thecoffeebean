// list dependencies
var express = require('express');
var router = express.Router();

// add db and mdoel dependencies
var mongoose = require('mongoose');
var Coffee = require('../models/coffee');

// Use formidable for images
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');

// show all the shops

router.get('/coffees', function (req, res, next) {
	Coffee.find(function (err, coffees){
		// if we have an error
		if (err) {
			res.render('error', { error: err });
		}
		else {
			res.render('coffees', { coffees: coffees });
		}

	});
});

// On click of the product show display page
router.get('/coffees/display/:id', function (req, res, next){
	var id = req.params.id;

	Coffee.findById(id, function (err, coffee){
		if (err) {
			res.send('Coffee ' + id + ' not found' );
		}
		else {
			res.render('display', {coffee: coffee});
		}
	});
});

// grab the edit page
router.get('/coffees/edit/:id', function (req, res, next){
	var id = req.params.id;

	Coffee.findById(id, function (err, coffee){
		if (err) {
			res.send('Coffee ' + id + ' not found' );
		}
		else {
			res.render('edit', {coffee: coffee});
		}
	});
});
// update the store
router.post('/coffees/edit/:id', function (req, res, next) {
	var id = req.body.id;

	// fill all inputs
	var coffee = {
		_id: id,
		title: req.body.title,
		description: req.body.description,
		established: req.body.established,
		location: req.body.location,
		coffeetypes: req.body.coffeetypes,
		coffeetype2: req.body.coffeetype2,
		coffeetype3: req.body.coffeetype3,
		weekAm: req.body.weekAm,
		weekPm: req.body.weekPm,
		satAm: req.body.satAm,
		satPm: req.body.satPm,
		sunAm: req.body.sunAm,
		sunPm: req.body.sunPm,
		email: req.body.email,
		phone: req.body.phone,
	};

	//execute the save
	Coffee.update({ _id: id }, coffee, function (err) {
		if (err) {
			res.render( 'error' , { error: err });
		}
		else {
			//save worked, redirect to updated product
			res.statusCode = 302;
			res.setHeader('location', 'http://' + req.headers['host'] +'/coffees');
			res.end();
		}
	});
});

router.get('/coffees/add', function(req, res, next){
	res.render('add');
});

router.post('/coffees/add', function (req, res, next) {
	var form = new formidable.IncomingForm();
	var title;
	var description;
	var established;
	var location;
	var coffeetypes;
	var coffeetype2;
	var coffeetype3;
	var weekAm;
	var weekPm;
	var satAm;
	var satPm;
	var sunAm;
	var sunPm;

	//something about the value throwing into the next form.on
	form.on('field', function(name, value) {
		if (name == 'title') {
			title = value;
		}
		else if (name == 'description') {
			description = value;
		}
		else if (name == 'established') {
			established = value;
		}
		else if (name == 'location') {
			location = value;
		}
		else if (name == 'coffeetypes') {
			coffeetypes = value;
		}
		else if (name == 'coffeetype2') {
			coffeetype2 = value;
		}
		else if (name == 'coffeetype3') {
			coffeetype3 = value;
		}
		else if (name == 'weekAm') {
			weekAm = value;
		}
		else if (name == 'weekPm') {
			weekPm = value;
		}
		else if (name == 'satAm') {
			satAm = value;
		}
		else if (name == 'satPm') {
			satPm = value;
		}
		else if (name == 'sunAm') {
			sunAm = value;
		}
		else if (name == 'sunPm') {
			sunPm = value;
		}
		else if (name == 'email') {
			email = value;
		}
		else if (name == 'phone') {
			phone = value;
		}
	});

	//push the form home to the data base
    form.on('end', function(fields, files) {
        var temp_path = this.openedFiles[0].path;

        var file_name = this.openedFiles[0].name;

        var new_location = 'public/images/';
        console.log(new_location + file_name);

        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.log(err);
            }
            else {
                Coffee.create({
                    title: title,
                    description: description,
                    established: established,
                    location: location,
                    coffeetypes: coffeetypes,
					coffeetype2: coffeetype2,
					coffeetype3: coffeetype3,
					weekAm: weekAm,
					weekPm: weekPm,
					satAm: satAm,
					satPm: satPm,
					sunAm: sunAm,
					sunPm: sunPm,
					email: email,
					phone: phone,
                    fileName: file_name
                }, function (err, coffee) {
                    if (err) {
                        console.log('error' + err);
                        res.render('error', { error: err });
                    }
                    else {
						console.log('Upload saved' + coffee);
						res.setHeader('Location', 'http://' + req.headers['host'] + '/coffees');
                        res.statusCode = 302;
                        res.end();
                    }
                }); //end create
            }
        });
    });

	form.parse(req);
}); // end post









router.get('/coffees/displayall', function (req, res, next) {
	Coffee.find(function (err, coffees){
		// if we have an error
		if (err) {
			res.render('error', { error: err });
		}
		else {
			res.render('displayall', { coffees: coffees });
		}

	});
});

// Delete product with selected id
router.get('/coffees/delete/:id', function (req, res, next) {
	//store the id from the url into a variable
	var id = req.params.id;

	Coffee.remove({_id:id }, function (err, coffee) {
		if (err) {
			res.send('Coffee' + id + ' not found');
		}
		else {
			res.statusCode = 302;
			res.setHeader('Location', 'http://' + req.headers['host'] + '/coffees');
			res.end();
		}
	});

});

// DISPLAY ALL API
router.get('/api/coffees', function (req, res, next) {
	Coffee.find(function (err, coffees){
		// if we have an error
		if (err) {
			res.render('error', { error: err });
		}
		else {
			res.render('coffee');
		}

	});
});

//DISPLAY SELECTED ID
router.get('/api/coffees/:id', function (req, res, next){
	var id = req.params.id;

	Coffee.findById(id, function (err, coffee){
		if (err) {
			res.send('Coffee ' + id + ' not found' );
		}
		else {
			res.render('coffee', {coffee: coffee});
		}
	});
});






// make controller public
module.exports = router;
