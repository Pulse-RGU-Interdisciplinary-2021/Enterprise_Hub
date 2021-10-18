const roomMssql = require('./room.mssql');
class room {
    async getAllRooms(req,res) {
        try {
            const output = await roomMssql.getAllRooms();
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getRoomById(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await roomMssql.getRoomById(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getRoomByName(req, res) {
        const room_name = req.params.room_name;
        try {
            if (!room_name) {
                console.log('no id passed');
            }
            const output = await roomMssql.getRoomById(room_name);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new room();