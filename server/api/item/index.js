'use strict';

var express = require('express');
var controller = require('./item.controller');

var router = express.Router();

router.get('/', controller.fetchItems);
router.post('/', controller.createItem);
router.put('/:id', controller.updateItem);

module.exports = router;