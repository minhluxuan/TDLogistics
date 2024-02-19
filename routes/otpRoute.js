const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const otpController = require("../controllers/otpController");

const router = express.Router();

const sessionStrategy = new LocalStrategy({
    usernameField: "phone_number",
    passwordField: "otp",
}, async (phone_number, otp, done) => {
    // const valid = await otpController.verifyOTPMiddleware(phone_number, otp);
    // if (!valid) {
    //     return done(null, false);
    // }
    
    const role = "USER";

    return done(null, {
        role,
        phone_number,
    });
});

passport.use("otpLogin", sessionStrategy);

router.get("/", (req, res) => {
    res.render("login");
});
router.post("/send_otp", otpController.createOTP);
router.post("/verify_otp", passport.authenticate("otpLogin"), (req, res, next) => {
    passport.authenticate("otpLogin", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({ error: true, message: "Xác thực thất bại." });
        }

        return res.status(200).json({ error: false, message: "Xác thực thành công." });
    })(req, res, next);
});

module.exports = router;
