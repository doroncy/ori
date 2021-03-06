/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var order = require('./order.model');
var socket;

exports.register = function(socketRef) {
  socket = socketRef;
};

exports.sendOrderCreatedMsg = function(msg) {
  if (!!socket) {
    socket.emit('orderCreated', msg);
  }
};
