const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const gelaphaController = require("../controllers/gelaphaController");
const {
  submit,
  history,
  vault,
  purchase,
} = require("../controllers/gelaphaController");

// // Submit item
// router.post(
//   "/submit",
//   authenticateUser,
//   submit
// );

// // View history
// router.get(
//   "/history",
//   authenticateUser,
//   history
// );

// // Browse thrift vault
// router.get(
//   "/vault",
//   authenticateUser,
//   vault
// );

// // Purchase an item
// router.post(
//   "/purchase",
//   authenticateUser,
//   purchase
// );
router.post(
    "/submit",
    authenticateUser,
    gelaphaController.submitItem
);

router.get(
    "/history",
    authenticateUser,
    gelaphaController.getHistory
);

router.get(
    "/vault",
    authenticateUser,
    gelaphaController.getVault
);

router.post(
    "/checkout",
    authenticateUser,
    gelaphaController.checkoutCart
);
module.exports = router;