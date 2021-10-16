var express = require('express');
var sql = require("mssql");

// database config
var config = {
    user: 'sa',
    password: 'P@55w0rd',
    server: '84.71.208.86',
    database: 'EIGBooking',
    options: {
        trustServerCertificate: true
    }
};

// connect to the database
sql.connect(config, err => { 
    if(err){
        console.log("Can't connect !")
        throw err ;
    }
    console.log("Connection Successful !")
});

module.exports = sql;