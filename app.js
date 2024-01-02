const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2");
const cron = require("cron");
const cors = require("cors");
const flash = require("express-flash");
const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require("./src/routes/usersRoute");
const otpRouter = require("./src/routes/otpRoute");


const dbOptions = {
	host: process.env.HOST,
	port: process.env.DBPORT,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE,
};
const pool = mysql.createPool(dbOptions);
  
const sessionStore = new MySQLStore({}, pool);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.enable('trust proxy');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: "da85#t*$as-t+&ru^c7t5u!r~e%a?nd89a+lg@o91r$i%t#hm",
	resave: false,
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		secure: true,
		sameSite: 'none',
		maxAge: 15 * 60 * 1000,
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

const cleanUpExpiredSession = new cron.CronJob("0 */12 * * *", async () => {
	try {
		const currentTime = new Date();
		await sessionStore.clearExpiredSessions(currentTime);
		console.log("Expired sessions has been cleared successfully!");
	} catch (err) {
	  	console.log("Error cleaning up expired session: ", err);
	}
});
  
cleanUpExpiredSession.start();

module.exports = app;
