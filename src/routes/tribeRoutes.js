// const express = require("express");

// const router = express.Router();

// const {
//   assignUserTribe,
// } = require("../controllers/tribeController");

// router.post("/assign", assignUserTribe);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  assignUserTribe,
  getAllTribes,
  getSingleTribe,
  getTribeProducts,
} = require("../controllers/tribeController");

router.post("/assign", assignUserTribe);

router.get("/", getAllTribes);

router.get("/:slug", getSingleTribe);

router.get("/:slug/products", getTribeProducts);

module.exports = router;