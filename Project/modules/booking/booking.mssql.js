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

    async getUpcomingBookingsbyPending(boolean){
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
        const res = await conn.request().query('select * from bookings where ((pending = ' + bit + ') and (start_datetime > sysdatetime())) order by start_datetime');
        return res.recordset;
    }

    async getBookingsByEvent(boolean){
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
        const res = await conn.request().query('select * from bookings where ((pending = 0) and (event_booking_yn = ' + bit + ')) order by start_datetime');
        return res.recordset;
    }

    async getUpcomingEventsbyPending(boolean){
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
        const res = await conn.request().query('select * from bookings where ((pending = ' + bit + ') and (event_booking_yn = \'1\')) order by start_datetime');
        console.log(res.recordset)
        return res.recordset;
    }

    async getUpcomingBookingsbyPendingNoEvents(boolean){
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
        const res = await conn.request().query('select * from bookings where ((pending = ' + bit + ') and (event_booking_yn IS NULL )) order by start_datetime');
        return res.recordset;
    }

    //gets bookings where an inputted time is between the booking's end and start time
    async getBookingByDate(dateTime) {
        var bit = 0
        const conn = await mssqlcon.getConnection();
        var query = 'select * from bookings where ((start_datetime <= \'' + dateTime + '\') and (end_datetime > (\'' + dateTime + '\')) and (pending = ' + bit + ')) order by start_datetime'
        const res = await conn.request().query(query);
        return res.recordset;
    }

    async getBookingByUserFullName(name){
        var bit = 0
        const conn = await mssqlcon.getConnection();
        var query = 'select * from bookings where (user_id in (select id from users where (full_name = \'' + name + '\')) and (pending = ' + bit + ')) order by start_datetime'
        const res = await conn.request().query(query);
        return res.recordset;
    }

    async getBookingByRoomName(name){
        var bit = 0
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from bookings where room_id in (select id from rooms where (room_name like \'%' + name + '%\') and (pending = '+ bit + ')) order by start_datetime');
        return res.recordset;
    }

    async getCountUnavailableDesksOfRoomAtTimeRange(roomId, startDateTime, endDateTime) {
        const conn = await mssqlcon.getConnection();
        var query = 'select count(desks) as \'deskn\' from bookings where ((room_id = ' + roomId + ') and (((start_datetime <= \'' + startDateTime + '\') and (\'' + startDateTime + '\' < end_datetime)) or ((end_datetime >= \'' + endDateTime + '\') and (\'' + endDateTime + '\' > start_datetime))))'
        const res = await conn.request().query(query);
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
        .input("confirmed",prod.confirmed)
        .input("pending",prod.pending)
        .input("seat_id",prod.seat_id)
        .input("event_booking_yn",prod.event_booking_yn)
        .input("user_name",prod.user_name)
        .input("user_email",prod.user_email)
        .input("user_number",prod.user_number)
        .input("user_role",prod.user_role)
        .execute("addBooking");
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
        return res;
    }
}
module.exports = new BookingMSSql;