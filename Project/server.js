const express = require("express");
const app = express();
var session = require("express-session");
var flash = require("connect-flash");
const https = require("http");

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
  res.render("pages/index", { message: "" });
});

app.get("/allBookings", function (req, res) {
  res.render("pages/allBookings");
});

app.get("/bookingRequests", function (req, res) {
  //test if admin
  //res.redirect('/queries/getBookingRequests')
  res.render("pages/bookingRequests");
});

app.get("/myBookings", function (req, res) {
  //res.redirect('/queries/getMyBookings')
  res.render("pages/myBookings");
});

app.get("/calendar", function (req, res) {
  res.render("pages/calendar");
});

app.get("/insights", function (req, res) {
  res.render("pages/insights");
});

app.get("/login", (req, res) => {
  res.render("pages/login", { message: req.flash("error_msg") });
});

app.post("/login", function (request, response) {
  // Get post parameters
  var username = request.body.username;
  var password = request.body.password;

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
      if (results > 0 && !err) {
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect("/");
      } else {
        request.flash("error_msg", "Invalid user and/or password");
        response.redirect("login");
      }
      response.end();
    });
  } else {
    request.flash("error_msg", "Invalid user and/or password");
    response.redirect("login");
    response.end();
  }
});

app.post("/register", (request, response) => {
  var name = request.name || "Pepe";
  var email = request.email || "email@gmail.com";
  var role = request.role || "";
  var password = request.password || "password";
  var repeatPassword = request.repeatPassword || "password";
  var phoneNumber = request.phoneNumber || "1234567890";

  if (!name) {
    response.redirect("login");
  }
  if (!email) {
    response.redirect("login");
  }
  if (!phoneNumber) {
    response.redirect("login");
  }
  if (!password) {
    response.redirect("login");
  }
  if (!repeatPassword) {
    response.redirect("login");
  }

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
  let capacity = 0;
  let desks = 0;
  let data= "";
  let roomName = "";
  let sql = require("mssql");
  let sqlRequest = new sql.Request();
  let query = `
  select rf.room_id, f.feature_desc
  from room_features_xref as rf  join features as f on rf.feature_id = f.id
  where rf.room_id = '` + request.params.roomId + `'        
  `
  https.get("http://localhost:4000/api/v1/rooms/Id/ " + request.params.roomId, (resp) => {
      //let data = "";
      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on("end", () => {
        data = JSON.parse(data);
        desks = data[0].max_desks;
        capacity = data[0].max_capacity;
        roomName = data[0].room_name;        
        sqlRequest.query(query, (err, results) => {
          if (err) throw err;
          data = results.recordset;
          console.log(desks);
          response.render("pages/login", { message: "",  data: data, roomName: roomName, desks: desks, roomId: request.params.roomId });
        });
      });
    }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
});

app.post("/book/:roomId", (request, response) => {
  console.log('in');
});
app.use("/queries", queries);

app.use(function (req, res) {
  res.status(404);
  res.render("pages/404");
});

app.listen(4000, () => console.log("My website is listening on port 4000!"));
