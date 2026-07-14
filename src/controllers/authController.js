const { signUp, login } = require("../services/authService");

// ----------------------
// SIGN UP
// ----------------------
const registerUser = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "email, password and username are required",
      });
    }

    const data = await signUp({
      email,
      password,
      username,
    });

    // return res.status(201).json({
    //   success: true,
    //   message: "User registered successfully",
    //   user: {
    //     id: data.user.id,
    //     email: data.user.email,
    //   },
    // });
//     return res.status(201).json({
//   success: true,
//   message: "User registered successfully",
//   user: data.user,
//   session: data.session,
// });
return res.status(201).json({
  success: true,
  message: "User registered successfully",
  user: data.user,
  session: data.session,
});

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ----------------------
// LOGIN
// ----------------------
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });

    }

    const data = await login({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      session: data.session,
      user: data.user,
    });

  } catch (err) {

    console.error(err);

    return res.status(401).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  registerUser,
  loginUser,
};