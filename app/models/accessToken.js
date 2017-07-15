'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Token = new Schema({
  'date': Number,
  'token': {
  "access_token": String,
  "token_type": String,
  "expires_in": Number
}
});













module.exports = mongoose.model('Token', Token);