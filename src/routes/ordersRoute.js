const express = require("express");
const ordersController = require("../controllers/ordersController");

const router = express.Router();

router.post("/check", ordersController.checkExistOrder);
router.get("/", ordersController.getAllOrders);
router.get("/search", ordersController.getOrder);

module.exports = router;