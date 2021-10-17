const room = require('./room');
const express = require('express');
const router = express.Router();
class RoomController {
    constructor(app) {
        router.get('/All', room.getAllRooms);
        router.get('/Id/:id', room.getRoomById);
        app.use('/api/v1/rooms',router);
    }
}

module.exports = RoomController