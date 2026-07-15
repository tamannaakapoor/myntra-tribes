const express = require("express");

const router = express.Router();

const {
  getQuizQuestions,
} = require("../controllers/quizController");

router.get("/questions", getQuizQuestions);

module.exports = router;