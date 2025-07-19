const express = require("express");
const authRouter = express.Router();
const { User } = require("../models/user");
const {
  signUpValidation,
  loginValidation,
} = require("../validations/authValidations");
const bcrypt = require("bcrypt");

authRouter.post("/api/auth/signup", signUpValidation, async (req, res) => {
  try {
    const { userData } = req;

    const existingUser = await User.findOne({ emailId: userData.emailId });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }
    // Hashing the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    // Creating a new user
    const user = new User(userData);
    await user.save();

    const token = user.getJWTToken();
    // Setting the token in the cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

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

authRouter.post("/api/auth/login", loginValidation, async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = user.getJWTToken();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    res.status(200).json({ message: "Login successful", user: userResponse });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = { authRouter };
