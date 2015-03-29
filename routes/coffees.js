// list dependencies
var express = require('express');
var router = express.Router();

// add db and mdoel dependencies
var mongoose = require('mongoose');
var Coffee = require('../models/coffee');

var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');

// interperept GET /products - show product listing 

router.get('/coffees', function (req, res, next) {
	// retreive all products using the product model; returns either an error or list of products
	Coffee.find(function (err, coffees){
		// if we have an error
		if (err) {
			res.render('error', { error: err });
		}
		else {
			res.render('coffees', { coffees: coffees });
			console.log(coffees);
		}

	});
});

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



// POST /products/:id - update selected product
router.post('/coffees/edit/:id', function (req, res, next) {
	var id = req.body.id;

	// use the product model fill ht eproperties and save the chages
	var Coffee = {
		_id: id,
		title: req.body.title,
		description: req.body.description,
		established: req.body.established,
		location: req.body.location,
		coffeetypes: req.body.coffeetypes
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

// GET /products/add - show product input form
router.get('/coffees/add', function(req, res, next){
	res.render('add');
});

router.post('/coffees/add', function (req, res, next) {
    var form = new formidable.IncomingForm();
    var title;

    form.on('field', function(name, value) {
        if (name == 'title') {
            title = value;
        }
    });
    
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
					description: req.body.description,
					established: req.body.established,
					location: req.body.location,
					coffeetypes: req.body.coffeetypes,
					fileName: file_name
                }, function (err, coffee) {
                    if (err) {
                        console.log(err);
                        res.render('error', { error: err });
                    }
                    else {
                        console.log('Upload saved');
                        res.render('added', { coffee: Coffee.title});
                        res.end();
                    }
                }); //end create    
            } //end else
        }); // end fs.copy
    }); // end form.on
}); // end post









//API GET products request handler
router.get('/api/coffee', function (req, res, next){
	Product.find(function(err, coffees) {
		if (err) {
			res.send(err);
		}
		else {
			res.send(coffees);
		}
	});
});

// get product delete request
//colon indicates variable in url
router.get('/coffees/delete/:id', function (req, res, next) {
	//store the id from the url into a variable
	var id = req.params.id;

	//use product model
	Coffee.remove({_id:id }, function (err, coffee) {
		if (err) {
			res.send('Coffee' + id + ' not found');
		}
		else {
			//indicates redierection one page to another
			res.statusCode = 302;
			res.setHeader('Location', 'http://' + req.headers['host'] + '/coffees');
			res.end();
		}
	});

});





// make controller public
module.exports = router;