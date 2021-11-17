var mssql = require("mssql");
class DBConnection {
    async getConnection() {
        try {
            return await mssql.connect({
                user: 'sa',
                password: 'P@55w0rd',
                server: '90.242.157.135',
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