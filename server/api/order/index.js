'use strict';

var express = require('express');
var controller = require('./order.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.fetchOrders);
router.post('/', auth.isAuthenticated(), controller.createOrder);
router.patch('/:id', controller.updateOrder);

module.exports = router;