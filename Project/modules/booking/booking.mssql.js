const mssqlcon = require('../../dbconnection.js');

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

    async getBookingsByPending(boolean) {
        var bit
        if (boolean.toLowerCase() == "true") {
            bit = 1
        }
        else if (boolean.toLowerCase() == "false"){
            bit = 0
        }
        else{
            console.log("Invalid booking pending request")
        }
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where pending = ' + bit);
        return res.recordset;
    }
}
module.exports = new BookingMSSql;