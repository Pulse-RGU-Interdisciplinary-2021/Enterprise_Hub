<<<<<<< HEAD
const bookingMssql = require('./booking.mssql');
class booking {
    async getAllBookings(req,res) {
        try {
            const output = await bookingMssql.getAllBookings();
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingById(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await bookingMssql.getBookingById(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingsByUser(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await bookingMssql.getBookingsByUser(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingsByRoom(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await bookingMssql.getBookingsByRoom(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async addBooking(req,res) {
        try {
            const output = await bookingMssql.addBooking(req.body);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }
    async getBookingsByPending(req,res) {
        const boolean = req.params.boolean;
        try {
            if (!boolean) {
                console.log('no boolean passed');
            }
            const output = await bookingMssql.getBookingsByPending(boolean);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async updateBooking(req,res) {
        try {
            const output = await bookingMssql.updateBooking(req.body);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }
    async getBookingByDate(req,res) {
        const dateTime = req.params.dateTime;
        try {
            if (!dateTime) {
                console.log('no datetime passed');
            }
            const output = await bookingMssql.getBookingByDate(dateTime);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingByUserFullName(req,res) {
        const name = req.params.name;
        try {
            if (!name) {
                console.log('no name passed');
            }
            const output = await bookingMssql.getBookingByUserFullName(name);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteBooking(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
             }
            const output = await bookingMssql.deleteBooking(id);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }
            
    async getBookingByRoomName(req,res) {
        const name = req.params.name;
        try {
            if (!name) {
                console.log('no room name passed');
            }
            const output = await bookingMssql.getBookingByRoomName(name);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCountUnavailableDesksOfRoomAtTimeRange(req,res) {
        const roomId = req.params.roomId;
        const startDateTime = req.params.startDateTime;
        const endDateTime = req.params.endDateTime;
        try {
            if (!roomId || !startDateTime || !endDateTime) {
                console.log('no parameters missing');
            }
            const output = await bookingMssql.getCountUnavailableDesksOfRoomAtTimeRange(roomId, startDateTime, endDateTime);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }
}

=======
const bookingMssql = require('./booking.mssql');
class booking {
    async getAllBookings(req,res) {
        try {
            const output = await bookingMssql.getAllBookings();
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingById(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await bookingMssql.getBookingById(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingsByUser(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await bookingMssql.getBookingsByUser(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingsByRoom(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
            }
            const output = await bookingMssql.getBookingsByRoom(id);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async addBooking(req,res) {
        try {
            const output = await bookingMssql.addBooking(req.body);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }
    async getBookingsByPending(req,res) {
        const boolean = req.params.boolean;
        try {
            if (!boolean) {
                console.log('no boolean passed');
            }
            const output = await bookingMssql.getBookingsByPending(boolean);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async updateBooking(req,res) {
        try {
            const output = await bookingMssql.updateBooking(req.body);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }
    async getBookingByDate(req,res) {
        const dateTime = req.params.dateTime;
        try {
            if (!dateTime) {
                console.log('no datetime passed');
            }
            const output = await bookingMssql.getBookingByDate(dateTime);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingByUserFullName(req,res) {
        const name = req.params.name;
        try {
            if (!name) {
                console.log('no name passed');
            }
            const output = await bookingMssql.getBookingByUserFullName(name);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteBooking(req,res) {
        const id = req.params.id;
        try {
            if (!id) {
                console.log('no id passed');
             }
            const output = await bookingMssql.deleteBooking(id);
            res.send(output);
        } catch (error) {
            console.log(error);
        }
    }
            
    async getBookingByRoomName(req,res) {
        const name = req.params.name;
        try {
            if (!name) {
                console.log('no room name passed');
            }
            const output = await bookingMssql.getBookingByRoomName(name);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getCountUnavailableDesksOfRoomAtTimeRange(req,res) {
        const roomId = req.params.roomId;
        const startDateTime = req.params.startDateTime;
        const endDateTime = req.params.endDateTime;
        try {
            if (!roomId || !startDateTime || !endDateTime) {
                console.log('no parameters missing');
            }
            const output = await bookingMssql.getCountUnavailableDesksOfRoomAtTimeRange(roomId, startDateTime, endDateTime);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingByDateTimeRange(req,res) {
        const startDateTime = req.params.startDateTime;
        const endDateTime = req.params.endDateTime;
        try {
            if (!startDateTime || !endDateTime) {
                console.log('no parameters missing');
            }
            const output = await bookingMssql.getBookingByDateTimeRange(startDateTime, endDateTime);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }

    async getBookingByRoomIdAndDateTimeRange(req,res) {
        const roomId = req.params.roomId;
        const startDateTime = req.params.startDateTime;
        const endDateTime = req.params.endDateTime;
        try {
            if (!roomId || !startDateTime || !endDateTime) {
                console.log('no parameters missing');
            }
            const output = await bookingMssql.getBookingByRoomIdAndDateTimeRange(roomId, startDateTime, endDateTime);
            res.send(output);
        }
        catch (error) {
            console.log(error);
        }
    }
}

>>>>>>> main
module.exports = new booking();