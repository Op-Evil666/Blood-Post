const { registerService } = require("../Services/authService");

const registerUser = async (req, res) => {
  const user = await registerService(req.body);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: user._id.toString(),
  });
};

module.exports = { registerUser };
