const assignTribe = require("../services/tribeAssignmentService");
const supabase = require("../config/supabase");

const assignUserTribe = async (req, res) => {
  try {
    const answers = req.body;

    const result = assignTribe(answers);

    const { data: tribe } = await supabase
      .from("tribes")
      .select("*")
      .eq("name", result.assigned)
      .single();

    return res.status(200).json({
      success: true,
      assigned: tribe,
      scores: result.scores,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  assignUserTribe,
};