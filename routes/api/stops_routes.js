var express = require('express');
var router = express.Router();
var gtfs = require('gtfs');

router.get('/:route_id', function(req, res, next) {
    var route_id = req.params.route_id;
    // radius of 0.48 is around 15 mins walk
    gtfs.getStopsByRoute('localAgency', route_id, function(err, stops) {
        if (!err) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(stops[0].stops));
        } else {
            console.log(err);
            throw err;
        }
    });
});

module.exports = router;