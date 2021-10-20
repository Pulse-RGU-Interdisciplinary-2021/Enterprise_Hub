const user = require('./user');
const express = require('express');
const router = express.Router();
class UserController {
    constructor(app) {
        router.get('/All', user.getAllUsers);
        router.get('/Id/:id', user.getUserById);
        router.get('/Name/:name', user.getUserByName);
        app.use('/api/v1/users',router);
    }
}

module.exports = UserController