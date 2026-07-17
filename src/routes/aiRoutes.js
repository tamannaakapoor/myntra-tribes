const express = require("express");

const router = express.Router();

const { autoWrite } = require("../controllers/aiController");

router.post("/generate-caption", autoWrite);

module.exports = router;