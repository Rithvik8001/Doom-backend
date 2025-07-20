const express = require("express");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const {
  profileEditValidation,
} = require("../validations/profileEditValidation");
const { User } = require("../models/user");
const {
  profilePasswordValidation,
} = require("../validations/profilePasswordValidation");

profileRouter.get("/api/user/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const response = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailId: user.emailId,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoUrl,
      about: user.about,
      gender: user.gender,
      skills: user.skills,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

profileRouter.patch(
  "/api/user/profile/edit",
  userAuth,
  profileEditValidation,

  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const sanitizedEditInfo = req.body;
      const updateUser = await User.findByIdAndUpdate(
        user._id,
        { $set: sanitizedEditInfo },
        { new: true }
      );
      if (!updateUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const response = {
        _id: updateUser._id,
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        emailId: updateUser.emailId,
        phoneNumber: updateUser.phoneNumber,
        photoUrl: updateUser.photoUrl,
        about: updateUser.about,
        gender: updateUser.gender,
        skills: updateUser.skills,
        age: updateUser.age,
        createdAt: updateUser.createdAt,
        updatedAt: updateUser.updatedAt,
      };
      res
        .status(200)
        .json({ message: "Profile updated successfully", user: response });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

profileRouter.patch(
  "/api/user/profile/edit/password",
  userAuth,
  profilePasswordValidation,

  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const newPassword = req.body.password;
      const isPasswordSame = await user.validatePassword(newPassword);
      if (isPasswordSame) {
        return res
          .status(400)
          .json({ message: "New password is same as old password" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateUserPassword = await User.findByIdAndUpdate(
        user._id,
        { $set: { password: hashedPassword } },
        { new: true }
      );
      if (!updateUserPassword) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = { profileRouter };
