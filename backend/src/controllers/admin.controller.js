exports.adminLogin = (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.json({
      status: "error",
      message: "Password is required",
    });
  }

  if (password !== process.env.ADMIN_KEY) {
    return res.json({
      status: "error",
      message: "Invalid admin password",
    });
  }

  res.status(200).json({
    status: "ok",
    message: "Admin login successful",
  });
};
