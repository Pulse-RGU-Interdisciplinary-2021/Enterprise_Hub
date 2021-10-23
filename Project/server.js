const express = require('express');
const app = express();
app.use(express.json());

async function init() {
    const approuting = require('./modules');
    const appmodules = new approuting(app);
    appmodules.init();
}
init();

app.use(express.static('public'));
app.set('view engine', 'ejs');

var db = require('./public/scripts/database')
var queries = require('./public/scripts/dbQueries')

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/landing', function (req, res) {
    res.render('pages/landing');
});

app.get('/booking', function (req, res) {
    res.render('pages/booking');
});


app.get('/allBookings', function (req, res) {
    res.render('pages/allBookings');
});

app.get('/bookingRequests', function (req, res) {
    //test if admin
    res.render('pages/bookingRequests');
});

app.get('/myBookings', function (req, res) {
    res.render('pages/myBookings');
});

app.get('/calendar', function (req, res) {
    res.render('pages/calendar');
});

app.get('/insights', function (req, res) {
    res.render('pages/insights');
});


app.get('/apiTest', function (req, res) {
    res.render('pages/apiTest')
});

app.get('/test', function (req, res) {
    console.log(res.array + "hhh")
    res.render('pages/test',{
        array : []
    })
});

app.post('/testPost', function (req, res) {
    console.log(res)
    res.redirect('/test')
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