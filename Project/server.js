const express = require("express");
const app = express();
var session = require("express-session");
var flash = require("connect-flash");
var nodemailer = require("nodemailer");
var functions = require("./functions");
const https = require("http");
let startingHour = "2021-10-30 10:00:00.000";
let endingHour = "2021-10-30 12:00:00.000";
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

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

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
  console.log("hi")
  res.redirect("/login");
});

/**app.get("/landing", function (req, res) {
  res.render("pages/landing");
});*/

app.get("/login", (req, res) => {
  console.log("hello")
  res.render("pages/landing", { session: req.session });
});

app.get("/calendar", function (req, res) {
  if (req.session.isAdmin) {
    res.render("pages/calendar", { session: req.session });
  }
  else {
    res.render("pages/404");
  }
});

app.get("/type", function (req, res) {
  console.log(req.session.isAdmin);
  res.render("pages/type", { session: req.session });
});

app.get("/booking", function (req, res) {
  res.render("pages/booking", { session: req.session });
});

app.get("/eventRoom", function (req, res) {
  res.render("pages/eventRoom", { session: req.session });
});


app.get('/room', function (req, res) {
  res.render('pages/room', { session: req.session, roomId, startDateTime, endDateTime });
});

app.get('/success', function (req, res) {
  var obj = {
  }
  functions.sendEmail("Booking Request Received", obj)
  res.render('pages/success', { session: req.session });
});

app.get('/failure', function (req, res) {
  res.render('pages/failure', { session: req.session });
})
app.get("/Type", function (req, res) {
  res.render("pages/type", { session: req.session });
});

app.get("/booking", function (req, res) {
  res.render("pages/booking", { session: req.session });
});

app.get("/eventRoom", function (req, res) {
  res.render("pages/eventRoom", { session: req.session });
});

app.get("/room", function (req, res) {
  res.render("pages/room", { session: req.session });
});

app.get("/allBookings", function (req, res) {
  if (req.session.isAdmin) {
    res.render("pages/allBookings", { session: req.session });
  }
  else {
    res.render("pages/404");
  }
});

app.get("/pendingRequests", function (req, res) {
  if (req.session.isAdmin) {
    res.render("pages/pendingRequests", { session: req.session });
  }
  else {
    res.render("pages/404");
  }
});

app.get("/myBookings", function (req, res) {
  res.render("pages/myBookings", { session: req.session, username: req.session.username });
});

app.get("/calendarsPage", function (req, res) {
  res.render("pages/calendarsPage", { session: req.session });
});

app.get("/insights", function (req, res) {
  if (req.session.isAdmin) {
    res.render("pages/insights", { session: req.session });
  }
  else {
    res.render("pages/404");
  }
});

app.get("/adminHome", function (req, res) {
  if (req.session.isAdmin) {
    res.render("pages/adminHome", { session: req.session });
  }
  else {
    res.render("pages/404");
  }
});

app.get("/adminPage", function (req, res) {
  res.render("pages/adminPage", { session: req.session });
});

app.get("/sessionUserId", async function (req, res) {
  console.log(req.session.loggedin + "  " + req.session.username)
  var id = await setIdVar(req.session.loggedin, req.session.username)

  try {
    res.send(id.toString());
    console.log(id + "hi")
  }
  catch (error) {
    console.log(error);
  }
});

async function setIdVar(loggedIn, username) {
  var id = "null"
  if (loggedIn) {
    id = username
    console.log(id + "uu")
  }

  return id
}

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
        console.log(results.recordset);
        if (results.recordset[0].enabled) {
          request.session.loggedin = true;
          request.session.username = results.recordset[0].id;
          request.session.isAdmin = results.recordset[0].admin;
          response.send("success");
        } else {
          response.send("User still not approved");
        }
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
  if (!functions.isValidEmail(email)) {
    response.send("Invalid email");
    response.end();
    return;
  }
  var sql = require("mssql");
  var sqlRequest = new sql.Request();
  var query =
    "insert into users values (0,null,'" +
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
    response.send("success");
  });

  var obj = {
    userName: name,
  }
  functions.sendEmail("Account Registration Request Received", obj)
});

app.get("/sendEmail", (req, res) => {
  let receiver = req.body.params.receiver;
  functions.sendEmail();
  res.send("success");
  res.end;
});

app.get("/book/:roomId", (request, response) => {
  let roomId = request.params.roomId;
  let capacity = 0;
  let desks = 0;
  let data = "";
  let roomName = "";
  https
    .get("http://localhost:4000/api/v1/rooms/Id/ " + roomId, (resp) => {
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        data = JSON.parse(data);
        capacity = data[0].max_capacity;
        roomName = data[0].room_name;
        functions.getRoomFeatures(roomId, (result) => {
          data = result;
          functions.getRemainingDesks(
            startingHour,
            endingHour,
            roomId,
            (result) => {
              desks = result;
              response.render("pages/login", {
                message: "",
                data: data,
                roomName: roomName,
                desks: desks,
                roomId: request.params.roomId,
                session: request.session
              });
            }
          );
        });
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

app.post("/book/:roomId", (request, response) => {
  let userId = request.session.username;
  let roomId = request.params.roomId;
  var desks = request.body.numbDesks;
  let sql = require("mssql");
  let sqlRequest = new sql.Request();
  let query =
    `
    insert into bookings(` +
    roomId +
    `,` +
    userId +
    `,2021-10-30 10:00:00.000, 2021-10-30 12:00:00.000,` +
    desks +
    `, null, 0,0,1 );
  `;
  sqlRequest.query(query, (err, res) => {
    if (err) throw err;
    console.log(res);
  });
});

app.get("/eventBooking", (request, response) => {
  let capacity = 0;
  let desks = 0;
  let data = "";
  let roomName = "";
  https
    .get("http://localhost:4000/api/v1/rooms/Id/ " + roomId, (resp) => {
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });
      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        data = JSON.parse(data);
        capacity = data[0].max_capacity;
        roomName = data[0].room_name;
        functions.getRoomFeatures(roomId, (result) => {
          data = result;
          response.render("pages/eventBooking", {
            data: data,
            roomName: roomName,
            roomId: roomId,
            session: request.session
          });
        });
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });
});

app.post("/eventBooking", (request, response) => {
  let organization = request.body.organization;
  let reason = request.body.reason;
  let userId = request.session.username;
  let sql = require("mssql");
  let sqlRequest = new sql.Request();
  let getDesks = "select max_desks from rooms where id = '" + roomId + "'";
  sqlRequest.query(getDesks, (err, res) => {
    if (err) throw err;
    let desks = res.recordset[0].max_desks;
    let query =
      `
    insert into bookings values(` +
      roomId +
      `,` +
      userId +
      `,'2021-10-30 10:00:00.000', '2021-10-30 12:00:00.000',` +
      desks +
      `, '` +
      organization +
      ": " +
      reason +
      `' , 0,0,1, null, 1, null, null, null, null);
  `;
    sqlRequest.query(query, (err, res) => {
      if (err) response.render("pages/failure", { session: request.session });
      response.render("pages/success", { session: request.session });
    });
  });
});

app.post("/bookingApproved", (req, res) => {
  var data = req.body
  var obj = {
    date: data.date,
    room: data.roomName,
    bookingType: data.bookingType,
  }
  functions.sendEmail("Booking Approval", obj);
  res.send("success");
})

app.post("/eventApproved", (req, res) => {
  var data = req.body
  var obj = {
    date: data.date,
    room: data.roomName,
    bookingType: data.bookingType,
  }
  functions.sendEmail("Event Request Approved", obj);
  res.send("success");
})

app.post("/bookingRejected", (req, res) => {
  var data = req.body
  var obj = {
    date: data.date,
    room: data.roomName,
    bookingType: data.bookingsType,
  }
  functions.sendEmail("Booking Rejected", obj)
})

app.post("/eventRejected", (req, res) => {
  var data = req.body
  var obj = {
    date: data.date,
    room: data.roomName,
    bookingType: data.bookingsType,
  }
  functions.sendEmail("Event Request Rejected", obj)
})

app.post("/accountApproved", (req, res) => {
  var data = req.body
  var obj = {
  }
  functions.sendEmail("Account Request Approved", obj)
})

app.post("/accountRejected", (req, res) => {
  var data = req.body
  var obj = {
    date: data.date,
    room: data.roomName,
    bookingType: data.bookingsType,
  }
  functions.sendEmail("Account Request Rejected", obj)
})

app.post("/setRoomId/:roomId", (req, res) => {
  roomId = req.params.roomId;
  console.log("hi there")
  console.log(req.session);
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
  res.render("pages/404", { session: req.session });
});

app.listen(4000, () => console.log("My website is listening on port 4000!"));
