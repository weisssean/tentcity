require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
const path = require("path");

var readOnce = require("./senseBME").readOnce;


var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);

app.use(express.static("client/html"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "client/html", "index.html"));
});

app.get("/sensor", (req, res, next) => {
  // res.send('ok');
  readOnce()
    .then((sensorData) => {
      console.log("Read DHT:", sensorData);
      res.json(sensorData);
    })
    .catch((err) => {
      next(createError(503));
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
