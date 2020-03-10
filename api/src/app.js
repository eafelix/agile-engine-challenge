/**
 * App Main Module
 * 
 * Module to init the express application, middlewares and dependencies
 * @module App
 */

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const log = require("./logger");
const cors = require("cors");

const accountRouter = require("./routes/account");

log.info('Configuring API...')
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/account", accountRouter);

/**
 * Middleware to catch 404 errors and forward to error handler
 */
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * Middleware to handle errors
 * @param {Error} - error created by Error consutructor or http-errors module
 */
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
