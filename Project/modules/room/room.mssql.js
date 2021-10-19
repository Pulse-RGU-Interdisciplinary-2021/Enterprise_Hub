const mssqlcon = require('../../dbconnection.js');

class RoomMSSql {
    async getAllRooms() {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from rooms');
        return res.recordset;
    }

    async getRoomById(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from rooms where id = ' + id);
        return res.recordset;
    }

    async getRoomByName(room_name) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from rooms where room_name = ' + room_name);
        return res.recordset;
    }

    async getRoomByDateTimeRange(startDateTime, endDateTime) {
        const conn = await mssqlcon.getConnection();
        var query = "select * from rooms where "
    }

}
module.exports = new RoomMSSql;