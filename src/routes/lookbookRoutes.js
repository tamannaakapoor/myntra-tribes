const express = require("express");

const router = express.Router();

const {
  createLookbook,
} = require("../controllers/lookbookController");

router.post("/", createLookbook);

module.exports = router;