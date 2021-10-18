class Module {
    constructor(app) {
        this.app = app;
    }
    init() {
        const bookingcontroller = require('./booking/booking.controller');
        new bookingcontroller(this.app);
        const roomcontroller = require('./room/room.controller');
        new roomcontroller(this.app);
        const usercontroller = require('./user/user.controller');
        new usercontroller(this.app)
    }
}
module.exports = Module