const profilePasswordValidation = (req, res, next) => {
  const password = req.body;
  const allowedFields = ["password"];
  const passwordKeys = Object.keys(password);
  const isPasswordValid = passwordKeys.every((key) =>
    allowedFields.includes(key)
  );
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid fields" });
  }

  next();
};

module.exports = { profilePasswordValidation };
