const express = require("express");
const usersController = require("../controllers/usersController");
const auth = require("../lib/auth2");

const router = express.Router();

router.post("/check", usersController.checkExistUser);
router.post("/create", usersController.createNewUser);
router.get("/", auth.isAuthenticated(), auth.isAuthorized(["USER"]), usersController.getOneUser);
router.put("/update", auth.isAuthenticated(), auth.isAuthorized(["USER"]), usersController.updateUserInfo);
router.get("/logout", auth.isAuthenticated(), auth.isAuthorized(["USER"]), usersController.logout);

module.exports = router;
