<<<<<<< HEAD
const mssqlcon = require('../../dbconnection.js');
const booking = require('./booking.js');

class BookingMSSql {
    async getAllBookings() {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings order by start_datetime');
        return res.recordset;
    }

    async getBookingById(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where id = ' + id + 'order by start_datetime');
        return res.recordset;
    }

    async getBookingsByUser(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where user_id = ' + id + 'order by start_datetime');
        return res.recordset;
    }

    async getBookingsByRoom(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where room_id = ' + id + 'order by start_datetime');
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
        const res = await conn.request().query('select * from bookings where pending = ' + bit + 'order by start_datetime');
        return res.recordset;
    }

    //gets bookings where an inputted time is between the booking's end and start time
    async getBookingByDate(dateTime) {
        const conn = await mssqlcon.getConnection();
        var query = 'select * from bookings where ((start_datetime <= \'' + dateTime + '\') and (end_datetime > (\'' + dateTime + '\'))) order by start_datetime'
        const res = await conn.request().query(query);
        console.log(res.recordset[0])
        return res.recordset;
    }

    async getBookingByUserFullName(name){
        const conn = await mssqlcon.getConnection();
        var query = 'select * from bookings where user_id in (select id from users where full_name = \'' + name + '\') order by start_datetime'
        const res = await conn.request().query(query);
        return res.recordset;
    }

    async getBookingByRoomName(name){
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where room_id in (select id from rooms where room_name like \'%' + name + '%\') order by start_datetime');
        return res.recordset;
    }

    async getCountUnavailableDesksOfRoomAtTimeRange(roomId, startDateTime, endDateTime) {
        const conn = await mssqlcon.getConnection();
        var query = 'select count(desks) as \'deskn\' from bookings where ((room_id = ' + roomId + ') and (((start_datetime <= \'' + startDateTime + '\') and (\'' + startDateTime + '\' < end_datetime)) or ((end_datetime >= \'' + endDateTime + '\') and (\'' + endDateTime + '\' > start_datetime))))'
        const res = await conn.request().query(query);
        console.log(res.recordset[0])
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
=======
const { start } = require('repl');
const mssqlcon = require('../../dbconnection.js');
const booking = require('./booking.js');

class BookingMSSql {
    async getAllBookings() {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings order by start_datetime');
        return res.recordset;
    }

    async getBookingById(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where id = ' + id + 'order by start_datetime');
        return res.recordset;
    }

    async getBookingsByUser(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where user_id = ' + id + 'order by start_datetime');
        return res.recordset;
    }

    async getBookingsByRoom(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where room_id = ' + id + 'order by start_datetime');
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
        const res = await conn.request().query('select * from bookings where pending = ' + bit + 'order by start_datetime');
        return res.recordset;
    }

    //gets bookings where an inputted time is between the booking's end and start time
    async getBookingByDate(dateTime) {
        const conn = await mssqlcon.getConnection();
        var query = 'select * from bookings where ((start_datetime <= \'' + dateTime + '\') and (end_datetime > (\'' + dateTime + '\'))) order by start_datetime'
        const res = await conn.request().query(query);
        console.log(res.recordset[0])
        return res.recordset;
    }

    async getBookingByUserFullName(name){
        const conn = await mssqlcon.getConnection();
        var query = 'select * from bookings where user_id in (select id from users where full_name = \'' + name + '\') order by start_datetime'
        const res = await conn.request().query(query);
        return res.recordset;
    }

    async getBookingByRoomName(name){
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where room_id in (select id from rooms where room_name like \'%' + name + '%\') order by start_datetime');
        return res.recordset;
    }

    async getCountUnavailableDesksOfRoomAtTimeRange(roomId, startDateTime, endDateTime) {
        const conn = await mssqlcon.getConnection();
        var query = 'select count(desks) as \'deskn\' from bookings where ((room_id = ' + roomId + ') and (((start_datetime <= \'' + startDateTime + '\') and (\'' + startDateTime + '\' < end_datetime)) or ((end_datetime >= \'' + endDateTime + '\') and (\'' + endDateTime + '\' > start_datetime))))'
        const res = await conn.request().query(query);
        console.log(res.recordset[0])
        return res.recordset;
    }

    async getBookingByDateTimeRange(startDateTime, endDateTime){
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where start_datetime > \'' + startDateTime + '\' and end_datetime < \'' + endDateTime + '\'');
        return res.recordset;
    }

    async getBookingByRoomIdAndDateTimeRange(id, startDateTime, endDateTime){
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where room_id = ' + id + ' and start_datetime > \'' + startDateTime + '\' and end_datetime < \'' + endDateTime + '\'');
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
>>>>>>> main
module.exports = new BookingMSSql;