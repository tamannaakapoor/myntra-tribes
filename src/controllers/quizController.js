// const quizQuestions = require("../data/quizQuestions");

// const getQuizQuestions = async (req, res) => {
//   return res.status(200).json({
//     success: true,
//     count: quizQuestions.length,
//     questions: quizQuestions,
//   });
// };

// module.exports = {
//   getQuizQuestions,
// };
const quizQuestions = require("../data/quizQuestions");
const { assignUserTribe } = require("./tribeController");

const getQuizQuestions = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: quizQuestions.length,
    questions: quizQuestions,
  });
};

module.exports = {
  getQuizQuestions,
  submitQuiz: assignUserTribe,
};