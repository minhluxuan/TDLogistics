const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const businessController = require("../controllers/businessController");
const Business = require("../database/Business");
const auth = require("../lib/auth");

const router = express.Router();

const sessionStrategy = new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
}, async (username, password, done) => {
    const resultGettingOneBusiness = await Business.getOneBusinessUser({ username: username });

    if (resultGettingOneBusiness.length <= 0) {
        done(null, false);
    }

    const business = resultGettingOneBusiness[0];

    if (!business) {
        return done(null, false);
    }

    const passwordFromDatabase = business.password;
    const match = bcrypt.compareSync(password, passwordFromDatabase);

    if (!match) {
        return done(null, false);
    }

    const business_id = business.business_id;
    const role = "BUSINESS_USER";
    const active = business.active;

    return done(null, {
        business_id,
        role,
        active,
    });
});

passport.use("businessLogin", sessionStrategy);

router.post("/login", passport.authenticate("businessLogin"), (req, res, next) => {
    passport.authenticate("businessLogin", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ error: true, message: "Xác thực thất bại." });
        }

        return res.status(200).json({ error: false, message: "Xác thực thành công." });
    })(req, res, next);
});
router.get("/", auth.isAuthenticated(), auth.isAuthorized(["BUSINESS_USER"]), auth.isActivated(), businessController.getOneBusinessUser);
router.patch("/update_password", auth.isAuthenticated(), auth.isAuthorized(["BUSINESS_USER"]), businessController.updatePassword);
router.get("/logout", auth.isAuthenticated(), auth.isAuthorized(["BUSINESS_USER"]), auth.isActivated(), businessController.logout);

module.exports = router;
