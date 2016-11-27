"use strict";
var express = require('express');
var router = express.Router();
var handlers = require("./handlers.js");

router.post('/search', handlers.getTweetsWithHashTagHandler);

module.exports = router;