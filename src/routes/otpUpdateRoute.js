const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const otpController = require("../controllers/otpController");
const Business = require("../database/Business");
const utils = require("../../utils");

const router = express.Router();

const sessionStrategy = new LocalStrategy({
  usernameField: "email",
  passwordField: "otp",
}, async (email, otp, done) => {

  const valid = await otpController.verifyOTPMiddleware(phone_number, otp);

  if (!valid) {
      return done(null, false);
  }

  const businessUser = await Business.getOneBusinessUser(["email"], [email]);

  if (businessUser.length <= 0) {
      return done(null, false);
  }

  const passwordFromDatabase = businessUser[0]["password"];
  const match = bcrypt.compareSync(password, passwordFromDatabase);

  if (!match) {
      return done(null, false);
  }

  const business_id = businessUser[0]["business_id"];
  const permission = 1;

  return done(null, {
    business_id,
    permission,
  });
});

passport.use("otpUpdate", sessionStrategy);

router.post("/send_otp_update", otpController.createOTP);
router.post("/verify_otp_update", passport.authenticate("otpUpdate", {
    failureRedirect: "/api/v1/otp/otp_fail",
    successRedirect: "/api/v1/otp/otp_success",
    failureFlash: true,
}), otpController.verifyOTPSuccess);
router.get("/otp_fail", otpController.verifyOTPFail);
router.get("/otp_success", otpController.verifyOTPSuccess);

passport.serializeUser(utils.setBusinessUserSession);
passport.deserializeUser((businessUser, done) => {
    utils.verifyBusinessPermission(businessUser, done);
});

module.exports = router;