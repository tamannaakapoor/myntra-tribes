const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  create,
  getMine,
  getById,
} = require("../controllers/lookbookController");

// Create Lookbook
router.post("/", authenticateUser, create);
router.get("/me", authenticateUser, getMine);
router.get("/:id", getById);
module.exports = router;