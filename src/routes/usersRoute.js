const express = require("express");
const usersController = require("../controllers/usersController");

const router = express.Router();

router.post("/check", usersController.checkExistUser);
router.post("/create", usersController.createNewUser);
router.get("/", usersController.getAllUsers);
router.patch("/update", usersController.updateUserInfo);
router.get("/search", usersController.getUser);
router.get("/logout", usersController.logout);

module.exports = router;
