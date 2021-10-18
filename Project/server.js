const express = require("express");
const app = express();
var session = require("express-session");
var flash = require("connect-flash");

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

app.get("/", function (req, res) {
  res.render("pages/index");

  title = document.getElementById("title");
  console.log(title);
});

app.get("/allBookings", function (req, res) {
  res.render("pages/allBookings");
});

app.get("/bookingRequests", function (req, res) {
  //test if admin
  res.redirect("/queries/getBookingRequests");
  //res.render('pages/bookingRequests');
});

app.get("/myBookings", function (req, res) {
  res.redirect("/queries/getMyBookings");
  //res.render('pages/myBookings');
});

app.get("/calendar", function (req, res) {
  res.render("pages/calendar");
});

app.get("/insights", function (req, res) {
  res.render("pages/insights");
});

app.get("/test", function (req, res) {
  res.redirect("/queries/getMyBookings");
  //res.render('pages/testingBookingPages');
});

app.get("/databaseTest", function (req, res) {
  // Create request object
  var request = new sql.Request();

  // Query database
  request.query("select * from rooms", function (err, recordset) {
    if (err) console.log(err);

    //log records in console
    console.log(recordset);
  });
  res.render("pages/index");
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

app.use("/queries", queries);

app.use(function (req, res) {
  res.status(404);
  res.render("pages/404");
});

app.listen(4000, () => console.log("My website is listening on port 4000!"));
