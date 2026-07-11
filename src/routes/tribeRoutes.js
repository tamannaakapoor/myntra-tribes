const express = require("express");

const router = express.Router();

const {
  assignUserTribe,
} = require("../controllers/tribeController");

router.post("/assign", assignUserTribe);

module.exports = router;