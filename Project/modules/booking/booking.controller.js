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
        router.get('/Pending/:boolean', booking.getBookingsByPending);
        router.get('/Date/:dateTime', booking.getBookingByDate);
        router.get('/UserFullName/:name', booking.getBookingByUserFullName);
        router.get('/RoomName/:name', booking.getBookingByRoomName);
        router.get('/CountUnavailableDesks/:roomId/:startDateTime/:endDateTime', booking.getCountUnavailableDesksOfRoomAtTimeRange)
        app.use('/api/v1/bookings',router);
    }
}

module.exports = BookingController