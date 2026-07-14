const express = require("express");

const router = express.Router();

const {
  analyzeOutfitImage,
  matchProductsFromTags,
} = require("../controllers/visionController");

router.post("/analyze", analyzeOutfitImage);
router.post("/match", matchProductsFromTags);

module.exports = router;
