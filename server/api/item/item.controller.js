'use strict';

var mongoose = require('mongoose'),
    Promise = require("bluebird"),
    _ = require("lodash"),
    Item = require('./item.model');

Promise.promisifyAll(mongoose);

/**
 * Fetch all Items
 */
function fetchItems(req, res) {
    Item
        .findAsync(req.query)
        .then(function(items) {
            return res.json(200, items);
        })
        .catch(function(err) {
            return res.json(500, err);
        });
}

/**
 * Fetch all Active Items
 */
function fetchActiveItems(req, res) {
    Item
        .findAsync({active:true})
        .then(function(items) {
            return res.json(200, items);
        })
        .catch(function(err) {
            return res.json(500, err);
        });
}

/**
 * Create Item
 */
function createItem(req, res) {

    var item = new Item( {
        name: req.body.name,
        description: req.body.description,
        amount: req.body.amount,
        price: req.body.price
    });

    item
        .saveAsync()
        .then(function() {
            return res.json(200, item);
        })
        .catch(function(err) {
            return res.json(500, err);
        });
}

/**
 * Update Item
 */
function updateItem(req, res) {
    console.log(req.params);
    Item
        .findOneAndUpdateAsync({_id: req.params.id }, {
            name: req.body.name,
            description: req.body.description,
            amount: req.body.amount,
            price: req.body.price,
            active: !!req.body.active
        })
        .then(function(result) {
            return res.json(200, result);
        })
        .catch(function(err) {
            return res.status(500).send(err);
        });
}


module.exports = {
    fetchItems: fetchItems,
    fetchActiveItems: fetchActiveItems,
    createItem: createItem,
    updateItem: updateItem
};