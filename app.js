const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractStrategy = require("passport-jwt").ExtractJwt;
const store = session.MemoryStore();

const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
const usersRouter = require("./src/routes/usersRoute");
const otpRouter = require("./src/routes/otpRoute");
const utils = require("./utils");

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: "your-secret",
	resave: false,
	saveUninitialized: false,
	store: store,
	cookie: {
		secure: false,
		httpOnly: true,
		maxAge: 5 * 60 * 1000,
	}
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/otp", otpRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
