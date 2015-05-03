'use strict';

var mongoose = require('mongoose'),
    Promise = require("bluebird"),
    _ = require("lodash"),
    moment = require('moment'),
    Order = require('./order.model'),
    Item = require('../item/item.model');

Promise.promisifyAll(mongoose);

function OutOfStockError(items) {
    this.code = "OUT_OF_STOCK";
    this.items = items;
}

/**
 * Fetch Orders
 */
function fetchOrders(req, res) {
    var startDate = req.query.startDate || moment().startOf('day');
    var endDate = req.query.endDate || moment().endOf('day');

    Order
        .find()
        .where('date').gte(startDate).lte(endDate)
        .sort('date')
        .populate({path: 'user', select:'name office email phone'})
        .exec()
        .then(function(orders) {
            return res.json(200, orders);
        },function(err) {
            return res.json(500, err);
        });
}

/**
 * Create Order
 */
function createOrder(req, res) {

    var order = new Order( {
        date: req.body.date,
        items: req.body.items,
        totalPrice: req.body.totalPrice,
        user: req.user._id
    });

    var dbOrder, errorItems = [],updatedItems = [];

    order
        .saveAsync()
        .then(function(savedResult) {
            dbOrder = savedResult[0];
            return Promise.map(req.body.items, function(item) {
                return Item
                    .findOneAsync({_id: item.id })
                    .then(function(dbItem) {
                        if (dbItem.amount < item.quantity) {
                            errorItems.push(item);
                        } else {
                            dbItem.amount = dbItem.amount - item.quantity;

                            return new Promise(function (resolve, reject) {
                                dbItem.save(function(err, updatedItem) {
                                    if(err) {
                                        reject(err);
                                    } else {
                                        updatedItems.push({
                                            itemId: updatedItem._id,
                                            quantity: item.quantity
                                        });
                                        resolve();
                                    }
                                })
                            });
                        }
                    })
            });
        })
        .then(function() {
            return new Promise(function (resolve, reject) {
                if (_.isEmpty(errorItems)) {
                    resolve();
                } else {
                    throw new OutOfStockError(_.pluck(errorItems, 'name'));
                }
            });
        })
        .then(function() {
            return res.json(200, {});
        })
        .catch(function(error) {
            Promise
                .map(updatedItems, function(item) {
                    return Item
                        .findOneAsync({_id: item.itemId })
                        .then(function(dbItem) {
                            dbItem.amount = dbItem.amount + item.quantity;

                            return new Promise(function (resolve, reject) {
                                dbItem.save(function() {
                                    resolve();
                                })
                            });
                        })
                })
                .then(function() {
                    dbOrder.remove(function() {
                        return res.json(500, error);
                    });
                });
        });
}


function updateOrder(req, res) {
    var orderId = req.params.id;
    var newStatus = req.body.status || 'submitted';

    Order
        .findByIdAndUpdateAsync(orderId, {status: newStatus})
        .then(function(order) {
            return res.json(200, order);
        })
        .catch(function(err) {
            return res.json(500, err);
        });
}


module.exports = {
    fetchOrders: fetchOrders,
    createOrder: createOrder,
    updateOrder: updateOrder
};