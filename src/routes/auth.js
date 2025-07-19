const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const { signUpValidation } = require("../validations/authValidations");
const bcrypt = require("bcrypt");

authRouter.post("/api/auth/signup", signUpValidation, async (req, res) => {
  try {
    const { userData } = req;

    const existingUser = await User.findOne({ emailId: userData.emailId });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }
    // Hashing the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Creating a new user
    const user = new User(userData);
    await user.save();

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      message: "User created successfully",
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = { authRouter };
