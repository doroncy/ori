/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Office = require('./office.model');

exports.register = function(socket) {
  Office.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Office.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('office:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('office:remove', doc);
}