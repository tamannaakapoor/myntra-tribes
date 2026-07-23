const express = require("express");

const router = express.Router();

const { createOrder } = require("../controllers/orderController");

const authenticateUser = require("../middleware/authMiddleware");

router.post("/", authenticateUser, createOrder);

module.exports = router;