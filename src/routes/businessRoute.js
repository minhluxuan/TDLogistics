const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const businessController = require("../controllers/businessController");
const utils = require("../../utils");
const Business = require("../database/Business");

const router = express.Router();

const sessionStrategy = new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
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

passport.use("businessLogin", sessionStrategy);

router.get("/", businessController.getOneBusinessUser);
router.post("/login", passport.authenticate("businessLogin", {
    successRedirect: "/api/v1/business/login_success",
    failureRedirect: "/api/v1/business/login_fail",
    failureFlash: true,
}), businessController.verifyBusinessUserSuccess);
router.post("/login_success", businessController.verifyBusinessUserSuccess);
router.post("/login_fail", businessController.verifyBusinessUserFail);
router.patch("/update_password", businessController.updatePassword);
router.get("/logout", businessController.logout);

module.exports = router;
