'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OfficeSchema = new Schema({
  names: String
});

module.exports = mongoose.model('Office', OfficeSchema);