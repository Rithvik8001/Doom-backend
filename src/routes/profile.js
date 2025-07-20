const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");

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

module.exports = { profileRouter };
