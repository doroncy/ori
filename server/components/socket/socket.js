'use strict';

var _ = require('lodash');
var socketIo = require('socket.io');
var io;


module.exports = {

    init: function(server) {
        io = socketIo.listen(server);

        io.on('connection', function(socket){
            socket.on('disconnect', function(){
            });
        });
    },

    addEventHandler: function addEventHandler(socketEventName, actionFunc) {
        if (!_.isFunction(actionFunc)) return false;

        io.on(socketEventName, actionFunc);
    },

    sendMessage: function(socketEventName, msg, socket) {
        if (socket) {
            socket.emit(socketEventName, msg);
        } else {
            io.emit(socketEventName, msg);
        }
    },

    getNumberOfConnectedSockets: function () {
        return _.size(io.sockets.connected);
    }

};
