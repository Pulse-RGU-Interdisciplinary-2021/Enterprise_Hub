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

    async getAllUsersByEnabled(boolean) {
        var bit
        if (boolean.toLowerCase() == "true") {
            bit = 1
        }
        else if (boolean.toLowerCase() == "false"){
            bit = 0
        }
        else{
            console.log("Invalid user enabled request")
        }
        const conn = await mssqlcon.getConnection();
        const res = await conn.request().query('select * from users where enabled = ' + bit);
        return res.recordset;
    }

    async updateUser(prod) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request()
        .input("user_id",prod.user_id)
        .input("enabled",prod.enabled)
        .input("user_image",prod.user_image)
        .input("full_name",prod.full_name)
        .input("email",prod.email)
        .input("phone_number", prod.phone_number)
        .input("password",prod.password)
        .input("admin",prod.admin)
        .execute("updateUser");
        return res;
    }

    async deleteUser(id) {
        const conn = await mssqlcon.getConnection();
        const res = await conn.request()
        .input("user_id",id)
        .execute("deleteUser");
        return res;
    }
}

module.exports = new UserMSSql;