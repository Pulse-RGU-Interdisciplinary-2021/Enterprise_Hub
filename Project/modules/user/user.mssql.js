const mssqlcon = require('../../dbconnection.js');

class UserMSSql {
    async getAllUsers() {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from users');
        return res.recordset;
    }

    async getUserById(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from users where id = ' + id);
        return res.recordset;
    }

    async getUserByName(name) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from users where full_name = ' + name);
        return res.recordset;
    }
}

module.exports = new UserMSSql;