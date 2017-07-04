'use strict';

var User = require('../models/user');

function server (passport) {
	this
		.checkTokens = function(req, res){
			var obj = (req.user).toObject();
		if	(obj.tokens) return res.render('profile', { user: req.user });
		req.logout();
		return res.redirect('/login');
		};
    this
        .githubRoute = passport.authenticate('github');
    
    this
        .githubCallback = passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this
	    .googleRoute = passport.authenticate('google', { scope: ['profile'] });
	    
	this
	    .googleCallback = passport.authenticate('google', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this
	    .twitterRoute = passport.authenticate('twitter');
	    
	this
	    .twitterCallback = passport.authenticate('twitter', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this
	    .facebookRoute = passport.authenticate('facebook');
	    
	this
	    .facebookCallback = passport.authenticate('facebook', {
		successRedirect: '/',
		failureRedirect: '/login' });
	
	this.unlinkGithub = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.github = undefined;
			currentUser.save(function(err,doc){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	
	this.unlinkGoogle = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.google = undefined;
			currentUser.save(function(err){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	
	this.unlinkTwitter = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.twitter = undefined;
			currentUser.save(function(err){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	
	this.unlinkFacebook = function(req, res) {
		var currentUser = req.user;
			currentUser.tokens.facebook = undefined;
			currentUser.save(function(err){
				if (err) throw err;
				res.redirect("/profile");
			});
	};
	this.deleteAccount = function(req, res) {
		User
			.findByIdAndRemove({'_id': req.user._id})
			.exec(function(err, doc){
				if (err) throw err;
				res.redirect('/index');
			});
	};
    
    
    
    
    
    
    
    
    
    
    
    
    
}
module.exports = server;