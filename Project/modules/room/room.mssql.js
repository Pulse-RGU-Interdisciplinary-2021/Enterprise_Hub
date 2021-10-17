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

}
module.exports = new RoomMSSql;