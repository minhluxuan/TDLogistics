const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "minhfaptv@gmail.com",
    pass: "zuko cgyk uvfj lfnt",
  }
});

const otpMap = new Map();

app.get("/send-otp", (req, res) => {
  const email = "minh.luxuanhcmut@hcmut.edu.vn";

  const otp = randomstring.generate({
    length: 6,
    charset: "numeric"
  });

  otpMap.set(email, otp);

  const mailOptions = {
    from: "minhfaptv@gmail.com",
    to: email,
    subject: "Xác thực OTP của bạn",
    text: `Mã OTP của bạn là ${otp}.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({error: `Fail to send OTP. Error: ${err}`});
    }

    res.status(200).json({message: "OTP sent successfully!"});
  });
});

app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpMap.get(email);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(400).send("OTP verification failed!");
  }

  otpMap.delete(email);

  res.status(200).send("OTP verification successful!");
});

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
