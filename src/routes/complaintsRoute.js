const express = require("express");
const router = express.Router();

const complaintsController = require("../controllers/complaintsController");

router.post("/create", complaintsController.createNewComplaint);
router.post("/search", complaintsController.getComplaints);
router.delete("/delete", complaintsController.deleteComplaint);

module.exports = router;