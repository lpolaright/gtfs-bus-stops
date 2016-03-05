var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('bushotspots', {title: 'Bus hot spots'});
});

module.exports = router;