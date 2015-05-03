'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
    date: { type: Date, default: Date.now },
    items: [{id: String, name: String, quantity: Number, itemPrice: Number}],
    totalPrice: Number,
    status: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Order', OrderSchema);
