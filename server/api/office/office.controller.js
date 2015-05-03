'use strict';

var _ = require('lodash');
var Office = require('./office.model');

// Get list of offices
exports.index = function(req, res) {
  Office.find(function (err, offices) {
    if(err) { return handleError(res, err); }
    return res.json(200, offices);
  });
};

// Get a single office
exports.show = function(req, res) {
  Office.findById(req.params.id, function (err, office) {
    if(err) { return handleError(res, err); }
    if(!office) { return res.send(404); }
    return res.json(office);
  });
};

// Creates a new office in the DB.
exports.create = function(req, res) {
  Office.create(req.body, function(err, office) {
    if(err) { return handleError(res, err); }
    return res.json(201, office);
  });
};

// Updates an existing office in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Office.findById(req.params.id, function (err, office) {
    if (err) { return handleError(res, err); }
    if(!office) { return res.send(404); }
    var updated = _.merge(office, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, office);
    });
  });
};

// Deletes a office from the DB.
exports.destroy = function(req, res) {
  Office.findById(req.params.id, function (err, office) {
    if(err) { return handleError(res, err); }
    if(!office) { return res.send(404); }
    office.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}