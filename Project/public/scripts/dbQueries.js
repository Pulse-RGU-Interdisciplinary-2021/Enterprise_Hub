var express = require('express');
var router = express.Router();
var db = require('./database');

var current_user_id = 2 //this will be changed once the login system is implemented
router.get('/getMyBookings', function (req, res, next) {
    var bookingsQuery = 'SELECT * from bookings WHERE bookings.user_id = ' + current_user_id 
    var request = new db.Request()
    request.query(bookingsQuery, function (err, data, fields) {
        if (err) throw err;
        res.render('pages/myBookings', { title: 'My Bookings', userData: data });
    });
});

router.get('/getBookingRequests', function (req, res, next) {
    var bookingsQuery = 'SELECT * from bookings WHERE bookings.pending = 1' 
    var request = new db.Request()
    request.query(bookingsQuery, function (err, data, fields) {
        if (err) throw err;
        console.log(data.recordset.length)
        res.render('pages/bookingRequests', { title: 'Bookings Requests', userData: data });
    });
});



module.exports = router;