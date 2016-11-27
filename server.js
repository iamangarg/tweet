"use strict";
var express = require('express'),
    bodyParser = require('body-parser'),
    config = require("config"),
    http = require("http"),
    morgan = require("morgan");

var app = express();

var twitter = require("./twitter_service/routes.js");

//setting Middlewares
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(express.static('./client'));

//setting views
app.set('views', './views');
app.set('view engine', 'jade');

//defining node port and ENV in case developer doesn't define them
process.env.NODE_ENV = process.env.NODE_ENV || "config";
app.set('port', process.env.NODE_PORT || process.env.PORT);


//attaching routes to the app
app.use('/twitter', twitter);
app.use('/', function (req, res){
    res.render("index.jade");
});

//creating server
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server started on port ' + app.get('port') + '...');
});