const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('pages/index');
});

app.get('/allBookings', function (req, res) {
    res.render('pages/allBookings');
});

app.get('/bookingRequests', function (req, res) {
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

app.use(function (req, res) {
    res.status(404);
    res.render('pages/404');
});


app.listen(4000, () => console.log('My website is listening on port 4000!'));