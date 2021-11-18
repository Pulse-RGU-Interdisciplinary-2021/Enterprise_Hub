const express = require("express");
const app = express();
var session = require("express-session");
var flash = require("connect-flash");
var nodemailer = require('nodemailer');
var functions = require("./functions");
const https = require("http");
let startingHour = "2021-10-30 10:00:00.000"
let endingHour = "2021-10-30 12:00:00.000"
let roomId = 0;
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

var db = require("./public/scripts/database");
var queries = require("./public/scripts/dbQueries");
app.use(express.json());

async function init() {
  const approuting = require("./modules");
  const appmodules = new approuting(app);
  appmodules.init();
}

init();

app.use(express.static("public"));
app.set("view engine", "ejs");

var db = require("./public/scripts/database");
var queries = require("./public/scripts/dbQueries");

app.get("/", function (req, res) {
  res.redirect("/login");
});

app.get('/landing', function (req, res) {
    res.render('pages/landing');
});

app.get('/calendar', function (req, res) {
    res.render('pages/calendar');
});

app.get('/Type', function (req, res) {
  res.render('pages/type');
});

app.get('/booking', function (req, res) {
    res.render('pages/booking');
});

app.get('/eventRoom', function (req, res) {
  res.render('pages/eventRoom');
});


app.get('/room', function (req, res) {
  res.render('pages/room', {roomId, startDateTime, endDateTime});
});


app.get('/allBookings', function (req, res) {
    res.render('pages/allBookings');
});

app.get("/pendingRequests", function (req, res) {
  //test if admin
  //res.redirect('/queries/getBookingRequests')
  res.render("pages/pendingRequests");
});

app.get('/myBookings', function (req, res) {
    res.render('pages/myBookings');
});

app.get("/calendar", function (req, res) {
  res.render("pages/calendar");
});

app.get("/insights", function (req, res) {
  res.render("pages/insights");
});

app.get("/login", (req, res) => {
  res.render("pages/landing", { message: req.flash("error_msg") || "" });
});

app.post("/login", function (request, response) {
  // Get post parameters
  var username = request.body.email;
  var password = request.body.psw;

  if (username && password) {
    /**
     * Creates query, if user is found session will be created and will be redirected to index,
     * if user not found error message will be sent to login page.
     */
    var sql = require("mssql");
    var sqlRequest = new sql.Request();
    var query =
      "select * from users where email = '" +
      username +
      "' and password = '" +
      password +
      "'";
    sqlRequest.query(query, (err, results) => {
      if (results.recordset.length > 0 && !err) {
        request.session.loggedin = true;
        request.session.username = username;
        response.send("success");
      } else {
        request.flash("error_msg", "Invalid user and/or password");
        response.send("Invalid user/password");
      }
      response.end();
    });
  } else {
    request.flash("error_msg", "Fields  cant be empty");
    response.send("No empty fields");
    response.end();
  }
});

app.post("/register", (request, response) => {
  var name = request.body.name;
  var email = request.body.email;
  var role = request.body.role || "";
  var password = request.body.password;
  var repeatPassword = request.body.repeatPassword;
  var phoneNumber = request.body.phoneNumber;
  var sql = require("mssql");
  var sqlRequest = new sql.Request();
  var query =
    "insert into users values (1,null,'" +
    name +
    "', '" +
    email +
    "', '" +
    phoneNumber +
    "', '" +
    password +
    "', 0)";
  sqlRequest.query(query, (err, results) => {
    if (err) throw err;
    console.log("Number of records inserted: " + results.affectedRows);
    response.redirect("login");
  });
});

app.get("/book/:roomId", (request, response) => {
  let roomId = request.params.roomId;
  let capacity = 0;
  let desks = 0;
  let data= "";
  let roomName = "";
  https.get("http://localhost:4000/api/v1/rooms/Id/ " + roomId, (resp) => {
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        data = JSON.parse(data);
        capacity = data[0].max_capacity;
        roomName = data[0].room_name;        
        functions.getRoomFeatures(roomId, (result) =>{
          data = result;
          functions.getRemainingDesks(startingHour, endingHour, roomId, (result) => {
            desks = result;
            response.render("pages/login", { message: "",  data: data, roomName: roomName, desks: desks, roomId: request.params.roomId });
          });
        });
      });
    }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

app.post("/book/:roomId", (request, response) => {
  let userId = request.session.username;
  let roomId = request.params.roomId;
  var desks = request.body.numbDesks;
  let sql = require("mssql");
  let sqlRequest = new sql.Request();
  let query = `
    insert into bookings(`+ roomId +`,`+ userId +`,2021-10-30 10:00:00.000, 2021-10-30 12:00:00.000,`+ desks +`, null, 0,0,1 );
  `
  sqlRequest.query(query, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
});

app.get("/eventBooking", (request, response) => {
  let capacity = 0;
  let desks = 0;
  let data= "";
  let roomName = "";
  https.get("http://localhost:4000/api/v1/rooms/Id/ " + roomId, (resp) => {
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        data = JSON.parse(data);
        capacity = data[0].max_capacity;
        roomName = data[0].room_name;        
        functions.getRoomFeatures(roomId, (result) =>{
          data = result;
          response.render("pages/eventBooking", {data: data, roomName: roomName, roomId: roomId });
        });
      });
    }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

app.post("/eventBooking", (request, response) => {
  let organization = request.body.organization; 
  let reason = request.body.reason;
  let userId = request.session.username || 5;
  let sql = require("mssql");
  let sqlRequest = new sql.Request();
  let getDesks = "select max_desks from rooms where id = '"+ roomId+ "'";
  sqlRequest.query(getDesks, (err, res) => {
    if(err) throw err;
    let desks = res.recordset[0].max_desks;
    let query = `
    insert into bookings values(`+ roomId +`,`+ userId +`,'2021-10-30 10:00:00.000', '2021-10-30 12:00:00.000',`+ desks +`, '`+ organization+ ": "+ reason +`' , 0,0,1, null, 1);
  `
   sqlRequest.query(query, (err, res) => {
      if(err) throw err;
      console.log('success');
      response.render("pages/insights", {rooId: roomId});
   });
  });
});

app.post("/setRoomId/:roomId", (req, res) => {
  roomId = req.params.roomId;
  res.send("success");
}); 

app.post("/setRoomIdDates/:roomId/:startDateTime/:endDateTime", (req, res) => {
  roomId = req.params.roomId;
  startDateTime = req.params.startDateTime;
  endDateTime = req.params.endDateTime;
  res.send("success");
}); 

app.use("/queries", queries);

app.use(function (req, res) {
  res.status(404);
  res.render("pages/404");
});

app.listen(4000, () => console.log("My website is listening on port 4000!"));
