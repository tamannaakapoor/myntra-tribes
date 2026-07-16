// const express = require("express");

// const router = express.Router();

// const {
//   getQuizQuestions,
// } = require("../controllers/quizController");

// router.get("/questions", getQuizQuestions);

// module.exports = router;

const express = require("express");

const router = express.Router();

const {
  getQuizQuestions,
  submitQuiz,
} = require("../controllers/quizController");

router.get("/questions", getQuizQuestions);

// Frontend calls this endpoint
router.post("/submit", submitQuiz);

module.exports = router;