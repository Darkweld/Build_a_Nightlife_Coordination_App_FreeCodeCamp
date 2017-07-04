'use strict';
var User = require('../models/user');
var auth = require('./auth.js');

var GitHubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function(passport) {
	
    passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
});

    passport.use(new GitHubStrategy ({
        clientID: auth.github.githubKey,
        clientSecret: auth.github.githubSecret,
        callbackURL: auth.github.callback,
        passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done) {
    	
if (!req.user) {
    User
        .findOneAndUpdate({ 'github.userid': profile.id}, {$set: {"tokens.github": accessToken}}, function (err, user) {
            if (err) return done(err);
            if (user) { return done(null, user) } else {
                var create = new User();
                create.github.userid = profile.id;
                create.github.username = profile.username;
                create.github.profileUrl = profile.profileUrl;
                create.tokens.github = accessToken;
                create.save(function(err){
                    if (err) console.log(err);
                });
                return done(null, create);
            }
    		});
} else {
	
	var alreadyhere = req.user;
		alreadyhere.github.userid = profile.id;
        alreadyhere.github.username = profile.username;
        alreadyhere.github.profileUrl = profile.profileUrl;
        alreadyhere.tokens.github = accessToken;
        alreadyhere.save(function(err) {
        	if (err) throw err;
        	return done(null, alreadyhere);
        });
}
}

));

	passport.use(new GoogleStrategy ({
        clientID: auth.google.clientId,
        clientSecret: auth.google.clientSecret,
        callbackURL: auth.google.callback,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
if (!req.user) {
    User
        .findOneAndUpdate({ 'google.userid' : profile.id }, {$set: {"tokens.google": accessToken}}, function (err, user) {
            if (err) return done(err);
            if (user) { return done(null, user) } else {
                var create = new User();
                create.google.userid = profile.id;
                create.google.username = profile._json.displayName;
                create.tokens.google = accessToken;
                create.save(function(err){
                    if (err) console.log(err);
                });
                return done(null, create);
            }
    		});
} else {
	
	var alreadyhere = req.user;
		alreadyhere.google.userid = profile.id;
        alreadyhere.google.username = profile._json.displayName;
        alreadyhere.tokens.google = accessToken;
        alreadyhere.save(function(err) {
        	if (err) throw err;
        	return done(null, alreadyhere);
        });
}
}

));

    passport.use(new TwitterStrategy ({
        consumerKey: auth.twitter.consumerKey,
        consumerSecret: auth.twitter.consumerSecret,
        callbackURL: auth.twitter.callback,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
if (!req.user) {
    User
        .findOneAndUpdate({ 'twitter.userid' : profile.id },{$set: {"tokens.twitter": accessToken}}, function (err, user) {
            if (err) return done(err);
            if (user) { return done(null, user) } else {
                var create = new User();
                create.twitter.userid = profile.id;
                create.twitter.username = profile.username;
                create.twitter.name = profile.displayName;
                create.tokens.twitter = accessToken;
                create.save(function(err){
                    if (err) console.log(err);
                });
                return done(null, create);
            }
    		});
} else {
	
	var alreadyhere = req.user;
		alreadyhere.twitter.userid = profile.id;
        alreadyhere.twitter.username = profile.username;
        alreadyhere.twitter.name = profile.name;
        alreadyhere.tokens.twitter = accessToken;
        alreadyhere.save(function(err) {
        	if (err) throw err;
        	return done(null, alreadyhere);
        });
}
}

));

    passport.use(new FacebookStrategy ({
        clientID: auth.facebook.facebookId,
        clientSecret: auth.facebook.facebookSecret,
        callbackURL: auth.facebook.callback,
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
if (!req.user) {
    User
        .findOneAndUpdate({ 'facebook.userid' : profile.id }, {$set: {"tokens.facebook": accessToken}}, function (err, user) {
            if (err) return done(err);
            if (user) { return done(null, user) } else {
                var create = new User();
                create.facebook.userid = profile.id;
                create.facebook.username = profile.displayName;
                create.tokens.facebook = accessToken;
                create.save(function(err){
                    if (err) console.log(err);
                });
                return done(null, create);
            }
    		});
} else {
	
	var alreadyhere = req.user;
		alreadyhere.facebook.userid = profile.id;
        alreadyhere.facebook.username = profile.displayName;
        alreadyhere.tokens.facebook = accessToken;
        alreadyhere.save(function(err) {
        	if (err) throw err;
        	return done(null, alreadyhere);
        });
}
}

));

};