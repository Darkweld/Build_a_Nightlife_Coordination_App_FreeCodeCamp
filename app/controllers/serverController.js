'use strict';

var User = require('../models/user');
var Token = require('../models/accessToken');
var Business = require('../models/businesses');
var https = require("https");
var querystring = require('querystring');

function server(passport) {
    this
        .checkTokens = function(req, res) {
            console.log(req.user);
            var obj = (req.user).toObject();
            if (obj.tokens) return res.render('profile', {
                user: req.user
            });
            req.logout();
            return res.redirect('/login');
        };
    this
        .githubRoute = passport.authenticate('github');

    this
        .githubCallback = passport.authenticate('github', {
            successRedirect: '/',
            failureRedirect: '/login'
        });

    this
        .googleRoute = passport.authenticate('google', {
            scope: ['profile']
        });

    this
        .googleCallback = passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/login'
        });

    this
        .twitterRoute = passport.authenticate('twitter');

    this
        .twitterCallback = passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/login'
        });

    this
        .facebookRoute = passport.authenticate('facebook');

    this
        .facebookCallback = passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/login'
        });

    this.unlinkGithub = function(req, res) {
        var currentUser = req.user;
        currentUser.tokens.github = undefined;
        currentUser.save(function(err, doc) {
            if (err) throw err;
            res.redirect("/profile");
        });
    };

    this.unlinkGoogle = function(req, res) {
        var currentUser = req.user;
        currentUser.tokens.google = undefined;
        currentUser.save(function(err) {
            if (err) throw err;
            res.redirect("/profile");
        });
    };

    this.unlinkTwitter = function(req, res) {
        var currentUser = req.user;
        currentUser.tokens.twitter = undefined;
        currentUser.save(function(err) {
            if (err) throw err;
            res.redirect("/profile");
        });
    };

    this.unlinkFacebook = function(req, res) {
        var currentUser = req.user;
        currentUser.tokens.facebook = undefined;
        currentUser.save(function(err) {
            if (err) throw err;
            res.redirect("/profile");
        });
    };
    this.deleteAccount = function(req, res) {
        User
            .findByIdAndRemove({
                '_id': req.user._id
            })
            .exec(function(err, doc) {
                if (err) throw err;
                res.redirect('/index');
            });
    };

    this.search = function(req, res) {

        if (!req.params.id) {
            return res.json({
                "error": "Please enter a valid address, neighborhood, city, state or zipcode"
            });
        }
        var test = req.params.id.replace(/\ /, "_");

        if (/[^a-zA-Z0-9_\.]+|^[\._]|[\._]$|[\._]{2,}?/.test(test)) {
            return res.json({
                "error": "Invalid input. Please enter a valid address, neighborhood, city, state or zipcode"
            });
        }

        req.session.search = test;

        function makeTokenRequest(fn) {
            return new Promise(function(resolve, reject) {
                var tokendata = querystring.stringify({
                    "grant_type": "client_credentials",
                    "client_id": process.env.YELP_CLIENTID,
                    "client_secret": process.env.YELP_CLIENTSECRET
                });

                var options = {
                    hostname: 'api.yelp.com',
                    path: '/oauth2/token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': Buffer.byteLength(tokendata)
                    }
                };

                var tokenrequest = https.request(options, function(response) {
                    var json = "";
                    response.on("data", function(data) {
                        json += data;
                    });
                    response.on('end', function() {
                        json = JSON.parse(json);
                        resolve(json);
                    });
                });

                tokenrequest.on('error', function(error) {
                    reject(error);
                });
                tokenrequest.write(tokendata);
                tokenrequest.end();

            }).then(function(result) {
                var dateparse = new Date();
                dateparse.setSeconds(result.expires_in);
                dateparse = Date.parse(dateparse);

                var newToken = new Token({
                    'date': dateparse,
                    'token': result
                });
                newToken.save().then(function(docs) {
                    if (docs) return fn();
                });
            });
        }


        (function yelpCall() {

            Token
                .findOne({})
                .exec(function(err, doc) {
                    if (err) return err;
                    if (!doc) return makeTokenRequest(yelpCall);
                    var date = Date.now();
                    if (date >= doc.date) {
                        Token.remove({}, function(err) {
                            if (err) return err;
                            return makeTokenRequest(yelpCall);
                        });
                    } else {

                        var options = {
                            hostname: 'api.yelp.com',
                            path: '/v3/businesses/search?term=bar&location=' + req.session.search + "&limit=50",
                            method: 'GET',
                            headers: {
                                'Authorization': doc.token.token_type + " " + doc.token.access_token
                            }
                        };

                        var getyelp = https.request(options, function(response) {
                            var json = "";
                            response.on("data", function(data) {
                                json += data;
                            });
                            response.on('end', function() {
                                json = JSON.parse(json);

                                var idarr = [];
                                if (!json.businesses) {
                                    return res.json({
                                        'error': 'No data found for that query.'
                                    })
                                }
                                for (var i = 0, l = json.businesses.length; i < l; i++) {
                                    idarr[i] = json.businesses[i].id;
                                }

                                Business
                                    .find({
                                        'businessID': {
                                            $in: idarr
                                        }
                                    })
                                    .exec(function(err, doc) {
                                        if (err) throw err;

                                        var arr = [];

                                        for (var i = 0, l = doc.length; i < l; i++) {
                                            arr[i] = doc[i].businessID;
                                        }

                                        var finalArray = [];

                                        for (var j = 0, k = idarr.length; j < k; j++) {
                                            if (arr.indexOf(idarr[j]) === -1)
                                                finalArray[j] = {
                                                    'businessID': json.businesses[j].id,
                                                    'state': json.businesses[j].location.state,
                                                    'businessName': json.businesses[j].name,
                                                    'businessYelpUrl': json.businesses[j].url,
                                                    'businessImageUrl': json.businesses[j].image_url,
                                                    'numberGoing': 0
                                                };
                                        }

                                        if (finalArray.length) {
                                            Business
                                                .insertMany(finalArray, function(err, docs) {
                                                    if (err) return err.message;
                                                    res.json(docs);
                                                });
                                        } else {


                                            Business
                                                .find({
                                                    'businessID': {
                                                        $in: idarr
                                                    }
                                                })
                                                .exec(function(err, results) {
                                                    if (err) throw err;
                                                    res.json(results);
                                                });
                                        }
                                    });


                            });
                        });
                        getyelp.end();


                    }
                });

        })();

    };




    this.busFind = function(req, res) {

        Business
            .findOne({
                'businessID': req.params.busid
            })
            .exec(function(err, doc) {
                if (err) return err;

                var user = req.user;

                if (user.visiting.indexOf(doc._id) !== -1) {
                    user.visiting.splice(user.visiting.indexOf(doc._id), 1);
                    doc.update({
                        $inc: {
                            'numberGoing': -1
                        }
                    }, function(err) {
                        if (err) throw err;
                        res.json(doc.numberGoing - 1);
                    });
                } else {
                    user.visiting.push(doc._id);
                    doc.update({
                        $inc: {
                            'numberGoing': 1
                        }
                    }, function(err) {
                        if (err) throw err;
                        res.json(doc.numberGoing + 1);
                    });
                }
                user.markModified('visiting');
                user.save(function(err) {
                    if (err) return err;
                });



            });

    };


    this.getUser = function(req, res) {
        User
            .findOne({
                '_id': req.user._id
            })
            .populate('visiting')
            .exec(function(err, result) {
                if (err) throw err;
                res.json(result);
            });
    };

}




module.exports = server;