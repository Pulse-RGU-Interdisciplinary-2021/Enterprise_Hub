const mssqlcon = require('../../dbconnection.js');
const booking = require('./booking.js');

class BookingMSSql {
    async getAllBookings() {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings');
        return res.recordset;
    }

    async getBookingById(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where id = ' + id);
        return res.recordset;
    }

    async getBookingsByUser(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where user_id = ' + id);
        return res.recordset;
    }

    async getBookingsByRoom(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where room_id = ' + id);
        return res.recordset;
    }

    async addBooking(prod) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request()
        .input("room_id",prod.room_id)
        .input("user_id",prod.user_id)
        .input("start_datetime",prod.start_datetime)
        .input("end_datetime",prod.end_datetime)
        .input("desks",prod.desks)
        .input("reason",prod.reason)
        .input("full_room_booking",prod.full_room_booking)
        .execute("addBooking");
        console.log(prod);
        return res;
    }

    async updateBooking(prod) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request()
        .input("booking_id",prod.booking_id)
        .input("room_id",prod.room_id)
        .input("user_id",prod.user_id)
        .input("start_datetime",prod.start_datetime)
        .input("end_datetime",prod.end_datetime)
        .input("desks",prod.desks)
        .input("reason",prod.reason)
        .input("full_room_booking",prod.full_room_booking)
        .input("confirmed",prod.confirmed)
        .input("pending",prod.pending)
        .execute("updateBooking");
        return res;
    }

    async deleteBooking(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request()
        .input("booking_id",id)
        .execute("deleteBooking");
        console.log(id)
        return res;
    }
}
module.exports = new BookingMSSql;