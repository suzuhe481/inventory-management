var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const inventoryRouter = require("./routes/inventory");

var app = express();

// Set up rate limiter. Max of 20 requests per minute.
// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute.
//   max: 20,
// });

// // Apply the rate limiter to all requests.
// app.use(limiter);

// Set up a Mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dev_db_url = "placeholder";
const mongoDB = process.env.MONGODB_URI || dev_db_url;

// Wait for database connect. Logs error if fail to connect.
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
      "img-src": ["'self'", "*.thegamesdb.net"],
    },
  })
);

app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/inventory", inventoryRouter);

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
  res.render("template/error");
});

module.exports = app;
