const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const {
    saveTrueFit,
    getTrueFit,
} = require("../controllers/truefitController");

// Save TrueFit profile
router.post("/save", authenticateUser, saveTrueFit);

// Fetch logged-in user's TrueFit profile
router.get("/me", authenticateUser, getTrueFit);

module.exports = router;