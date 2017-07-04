'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    github: {
     userid : String,
     username: String,
     profileUrl: String,
    },
    google: { 
     userid: String,
     username: String,
   },
   twitter: {
    userid: String,
    username: String,
    name: String,
   },
   facebook: {
    userid: String,
    username: String,
   },
   tokens: {
    github: String,
    google: String,
    twitter: String,
    facebook: String
   }
});













module.exports = mongoose.model('User', User);