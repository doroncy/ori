/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var order = require('./order.model');

exports.register = function(socket) {
    order.schema.post('save', function (doc) {
        onSave(socket, doc);
    });
};

function onSave(socket, doc, cb) {
    var orderDoc = doc;
    doc.populate({path: 'user', select:'name office email phone'}, function() {
        socket.emit('order:save', orderDoc);
    });
}