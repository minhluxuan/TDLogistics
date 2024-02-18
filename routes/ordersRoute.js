const express = require("express");
const ordersController = require("../controllers/ordersController");

const router = express.Router();

router.get("/check", ordersController.checkExistOrder);
router.get("/get_status", ordersController.getOrderStatus);
router.get("/search_order_id", ordersController.getOrderByOrderID);
router.get("/search_user_id", ordersController.getOrderByUserID);
router.post("/create", ordersController.createNewOrder);
router.post("/calculate_fee", ordersController.calculateFee);
router.patch("/update", ordersController.updateOrder);
router.delete("/cancel", ordersController.cancelOrder);

router.get('/', ordersController.getOrders);

module.exports = router;