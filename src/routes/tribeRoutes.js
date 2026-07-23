// const express = require("express");

// const router = express.Router();

// const {
//   assignUserTribe,
// } = require("../controllers/tribeController");

// router.post("/assign", assignUserTribe);

// module.exports = router;
const authenticateUser = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const {
  assignUserTribe,
  getAllTribes,
  getSingleTribe,
  getTribeProducts,
    selectTribe,

} = require("../controllers/tribeController");

// router.post("/assign", assignUserTribe);
router.post(
    "/assign",
    authenticateUser,
    assignUserTribe
);

router.get("/", getAllTribes);

router.get("/:slug", getSingleTribe);

router.get("/:slug/products", getTribeProducts);
router.post("/select", authenticateUser, selectTribe);
module.exports = router;