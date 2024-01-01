const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const otpController = require("../controllers/otpController");
const utils = require("../../utils");

const router = express.Router();

const sessionStrategy = new LocalStrategy({
    usernameField: "phone_number",
    passwordField: "otp",
}, async (phone_number, otp, done) => {
    console.log(phone_number);
    console.log(otp);
    const valid = await otpController.verifyOTPMiddleware(phone_number, otp);
    if (!valid) {
        return done(null, false);
    }

    const permission = 1;

    return done(null, {
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
router.post("/test", (req, res) => {
    console.log(req.body.phone_number);
    console.log(req.body.otp);
    res.status(200).send("OK");
});
            
passport.serializeUser(utils.setSession);
passport.deserializeUser((user, done) => {
    utils.verifyPermission(user, done);
});

module.exports = router;
