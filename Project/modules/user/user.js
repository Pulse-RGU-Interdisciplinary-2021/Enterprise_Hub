const userMssql = require('./user.mssql');
class user {
    async getAllUsers(req,res) {
        try {
            const output = await userMssql.getAllUsers();
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getUserById(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await userMssql.getUserById(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new user();