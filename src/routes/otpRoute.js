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

router.post("/send-otp", otpController.createOTP);
router.post("/verify-otp", passport.authenticate("local", {
    failureRedirect: "/api/v1/otp/otp-fail",
    successRedirect: "/api/v1/otp/otp-success",
    failureFlash: true,
}), otpController.verifyOTPSuccess);
router.get("/otp-fail", otpController.verifyOTPFail);
router.get("/otp-success", otpController.verifyOTPSuccess);
router.get("/get-user", (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json({
            error: false,
            user: {
                phone_number: req.user.phone_number,
                permission: req.user.permission,
            },
            message: "Lấy thông tin thành công!", 
        });
    }

    return res.status(401).json({
        error: true,
        user: undefined,
        message: "Bạn không được cấp quyền truy cập vào tài nguyên này!"
    });
});

passport.serializeUser(utils.setSession);
passport.deserializeUser((user, done) => {
    console.log(user);
    utils.verifyPermission(user, done);
});

module.exports = router;