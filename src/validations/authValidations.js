const validator = require("validator");

const signUpValidation = (req, res, next) => {
  const allowedFields = ["firstName", "lastName", "emailId", "password"];

  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );
  if (extraFields.length > 0) {
    return res.status(400).json({
      message: `Invalid fields detected: ${extraFields.join(
        ", "
      )}. Only ${allowedFields.join(", ")} are allowed.`,
    });
  }

  const { firstName, lastName, emailId, password } = req.body;

  try {
    // Check for missing required fields
    if (!firstName || !lastName || !emailId || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate name lengths
    if (firstName.length < 3 || lastName.length < 3) {
      return res.status(400).json({
        message: "First name and last name must be at least 3 characters long",
      });
    }

    if (firstName.length > 20 || lastName.length > 20) {
      return res.status(400).json({
        message:
          "First name and last name must be less than 20 characters long",
      });
    }

    // Validate email format
    if (!validator.isEmail(emailId)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Validate password strength and length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    if (password.length > 20) {
      return res
        .status(400)
        .json({ message: "Password must be less than 20 characters long" });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Password is not strong enough. It should contain at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.",
      });
    }

    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailId: emailId.toLowerCase().trim(),
      password: password,
    };

    req.userData = userData;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal validation error" });
  }
};

const loginValidation = async (req, res, next) => {
  const { emailId, password } = req.body;
  const allowedFields = ["emailId", "password"];

  const extraFields = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    return res.status(400).json({
      message: `Invalid fields detected: ${extraFields.join(
        ", "
      )}. Only ${allowedFields.join(", ")} are allowed.`,
    });
  }
  if (!emailId || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!validator.isEmail(emailId)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  next();
};

module.exports = { signUpValidation, loginValidation };
