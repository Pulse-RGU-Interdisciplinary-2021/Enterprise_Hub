const mssqlcon = require('../../dbconnection.js');

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
        var query = "select count(desks) from bookings where room_id = " + roomId + "and ((start_datetime <= " + startDateTime + " and " + startDateTime + " < end_datetime) or (end_datetime >= " + endDateTime + " and " + endDateTime + " > start_datetime))"
        const res = await conn.request().query(query);
        return res.recordset;
    }
}
module.exports = new BookingMSSql;