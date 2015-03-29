var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//add dependencies for file upload
var formidable = require('formidable');
var util = require('util');
var fs = require('fs-extra');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.post('/coffees/add', function (req, res) {
    var form = new formidable.IncomingForm();
    var title;
    
    form.parse(req, function (err, fields, files) {
        res.render('added', { coffee: Coffee.title});
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
                    }
                }); //end create    
            }
    }); 
});


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);



//db
var mongoose = require('mongoose');
mongoose.connect('mongodb://samamaguire:7glrFart@ds041851.mongolab.com:41851/coffee');



var coffees = require('./routes/coffees');
app.use('/', coffees);

//post request for file upload on home page
// app.post('/', function (req, res, next){
//     //use the formidable package to process the file upload
//     var form = new formidable.IncomingForm;
//     form.parse(req, function (err, fields, files) {
//         res.writeHead(200);
//         res.write('file uploaded\n');
//         res.end(util.inspect({ fields: fields, files: files}));
//     });

//     // copy the file from the temp location to public/images
//     form.on('end', function (fields, files) {
//         var temp_path = this.openedFiles['upload'].path;

//         var file_name = this.openedFiles['upload'].name;

//         var new_path = 'public/images/';

//         //copy images to folder
//         fs.copy(temp_path, new_path + file_name, function(err) {
//             if (err) {
//                 res.render('error' { error: err} );
//                 res.end('Image Upload error')
//             }
//             else {
//                 res.end('Image Uploaded Seccessfully');
//             }
//         }
//     });
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
