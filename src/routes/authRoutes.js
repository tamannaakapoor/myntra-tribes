const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const authenticateUser = require("../middleware/authMiddleware");

router.get("/me", authenticateUser, (req, res) => {

    return res.status(200).json({

        success: true,

        user: req.user

    });

});

// POST /api/auth/signup
router.post("/signup", registerUser);
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

module.exports = router;