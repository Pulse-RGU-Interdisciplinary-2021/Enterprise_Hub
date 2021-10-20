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

    async updateBooking(req,res) {
        try {
            const output = await bookingMssql.updateBooking(req.body);
            res.send(output);
        } catch (error) {
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
}

module.exports = new booking();