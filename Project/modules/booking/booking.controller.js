const booking = require('./booking');
const express = require('express');
const router = express.Router();
class BookingController {
    constructor(app) {
        router.get('/All', booking.getAllBookings);
        router.get('/Id/:id', booking.getBookingById);
        router.get('/UserId/:id', booking.getBookingsByUser);
        router.get('/RoomId/:id', booking.getBookingsByRoom);
        router.post('/',booking.addBooking);
        router.put('/',booking.updateBooking);
        router.delete('/delete/:id',booking.deleteBooking);
        app.use('/api/v1/bookings',router);
    }
}

module.exports = BookingController