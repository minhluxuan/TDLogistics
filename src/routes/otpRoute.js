const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const otpController = require("../controllers/otpController");
const utils = require("../../utils");
const Users = require("../database/Users");

const router = express.Router();

const sessionStrategy = new LocalStrategy({
    usernameField: "phone_number",
    passwordField: "otp",
}, async (phone_number, otp, done) => {
    const valid = await otpController.verifyOTPMiddleware(phone_number, otp);
    if (!valid) {
        return done(null, false);
    }

    const user = await Users.getOneUser(["phone"], [phone_number]);

    let user_id = undefined;

    if (user.length > 0) {
        user_id = user[0]["user_id"];
    } 

    const permission = 1;

    return done(null, {
        user_id,
        phone_number,
        permission,
    });
});

passport.use(sessionStrategy);

router.post("/send_otp", otpController.createOTP);
router.post("/verify_otp", passport.authenticate("local", {
    failureRedirect: "/api/v1/otp/otp_fail",
    successRedirect: "/api/v1/otp/otp_success",
    failureFlash: true,
}), otpController.verifyOTPSuccess);
router.get("/otp_fail", otpController.verifyOTPFail);
router.get("/otp_success", otpController.verifyOTPSuccess);
            
passport.serializeUser(utils.setSession);
passport.deserializeUser((user, done) => {
    utils.verifyPermission(user, done);
});

module.exports = router;
