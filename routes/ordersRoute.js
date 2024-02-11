const express = require("express");
const ordersController = require("../controllers/ordersController");

const router = express.Router();

router.get("/check", ordersController.checkExistOrder);
router.get("/get_status", ordersController.getOrderStatus);
router.get("/search_orderid", ordersController.getOrderByOrderID);
router.get("/search_userid", ordersController.getOrderByUserID);
router.post("/create", ordersController.createNewOrder);
router.post("/calculatefee", ordersController.calculateFee);
router.patch("/update", ordersController.updateOrder);
router.delete("/cancel", ordersController.cancelOrder);

router.get('/', ordersController.getOrders);

module.exports = router;