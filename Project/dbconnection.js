var mssql = require("mssql");
class DBConnection {
    async getConnection() {
        try {
            return await mssql.connect({
                user: 'sa',
                password: 'P@55w0rd',
                server: '84.71.233.120',
                database: 'EIGBooking',
                options: {
                    trustServerCertificate: true
                }
            });
        }
        catch(error) {
            console.log(error);
        }
    }
}
module.exports = new DBConnection();