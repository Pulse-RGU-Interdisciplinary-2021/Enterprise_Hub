<<<<<<< HEAD
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

=======
const user = require('./user');
const express = require('express');
const router = express.Router();
class UserController {
    constructor(app) {
        router.get('/All', user.getAllUsers);
        router.get('/Id/:id', user.getUserById);
        router.get('/Name/:name', user.getUserByName);
        router.get('/Enabled/:boolean', user.getAllUsersByEnabled);
        router.put('/',user.updateUser);
        router.delete('/delete/:id',user.deleteUser);
        app.use('/api/v1/users',router);
    }
}

>>>>>>> main
module.exports = UserController