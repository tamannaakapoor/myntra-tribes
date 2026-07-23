// const express = require("express");

// const router = express.Router();

// const {
//   createOrder,
//   getUserOrders,
// } = require("../controllers/orderController");

// const authenticateUser = require("../middleware/authMiddleware");

// router.get("/", authenticateUser, getUserOrders);

// router.post("/", authenticateUser, createOrder);

// module.exports = router;
const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  createOrder,
  getUserOrders,
} = require("../controllers/orderController");

router.get("/", authenticateUser, getUserOrders);

router.post("/", authenticateUser, createOrder);

module.exports = router;