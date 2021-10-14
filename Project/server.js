const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

var db = require('./public/scripts/database')
var queries = require('./public/scripts/dbQueries')

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/allBookings', function (req, res) {
    res.render('pages/allBookings');
});

app.get('/bookingRequests', function (req, res) {
    //test if admin
    res.redirect('/queries/getBookingRequests')
    //res.render('pages/bookingRequests');
});

app.get('/myBookings', function (req, res) {
    res.redirect('/queries/getMyBookings')
    //res.render('pages/myBookings');
});

app.get('/calendar', function (req, res) {
    res.render('pages/calendar');
});

app.get('/insights', function (req, res) {
    res.render('pages/insights');
});

app.get('/test', function (req, res) {
    res.redirect('/queries/getMyBookings')
    //res.render('pages/testingBookingPages');
});

/** 
app.get('/databaseTest', function (req, res) {
    
        // Create request object
        var request = new sql.Request();

        // Query database
        request.query("select * from rooms", function (err, recordset) {
            if (err) console.log(err)

            //log records in console
            console.log(recordset);
        });  
    });

    res.render('pages/index');
});*/

app.use('/queries', queries)

app.use(function (req, res) {
    res.status(404);
    res.render('pages/404');
});


app.listen(4000, () => console.log('My website is listening on port 4000!'));