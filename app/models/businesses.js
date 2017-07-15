'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Business = new Schema({
businessID : String,
businessName: String,
businessYelpUrl: String,
businessImageUrl: String,
state: String,
numberGoing: Number,
});













module.exports = mongoose.model('Business', Business);