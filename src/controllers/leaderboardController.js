const {
  getLeaderboardService,
} = require("../services/leaderboardService");

const getLeaderboard = async (req, res) => {
  try {

    const leaders = await getLeaderboardService();

    return res.status(200).json({
      success: true,
      count: leaders.length,
      leaders,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  getLeaderboard,
};