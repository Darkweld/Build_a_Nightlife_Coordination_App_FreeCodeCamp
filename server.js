'use strict';

var express = require('express');
var routes = require('./app/routes/routes.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
require('dotenv').load();

require('./app/auth/passport')(passport);

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set('view engine', 'ejs');
app.set('views', 'public/views');

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/css', express.static(process.cwd() + '/public/css'));
app.use('/ajax', express.static(process.cwd() + '/app/ajax'));

app.use(session({
	secret: 'angryBeavers',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Server listening on port ' + port + '...');
});