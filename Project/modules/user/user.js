<<<<<<< HEAD
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

    async getUserByName(req,res) {
        const name = req.params.name;
        try {
            if (!name) {
                console.log('no name passed');
            }
            const output = await userMssql.getUserByName(name);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }
}

=======
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

    async getUserByName(req,res) {
        const name = req.params.name;
        try {
            if (!name) {
                console.log('no name passed');
            }
            const output = await userMssql.getUserByName(name);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getAllUsersByEnabled(req,res){
        const boolean = req.params.boolean;
        try {
            if (!boolean) {
                console.log('no boolean passed');
            }
            const output = await userMssql.getAllUsersByEnabled(boolean);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async updateUser(req,res) {
        try {
            const output = await userMssql.updateUser(req.body);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteUser(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
             }
            const output = await userMssql.deleteUser(id);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }
}

>>>>>>> main
module.exports = new user();