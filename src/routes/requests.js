const express = require("express");
const mongoose = require("mongoose");
const requestsRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const { ConnectionRequests } = require("../models/connectionRequests");
const { User } = require("../models/user");

requestsRouter.post(
  "/api/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // Check if the status is valid
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      // Check if the toUserId is valid ObjectId format
      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        return res.status(400).json({ message: "User not found" });
      }

      // Check if the toUserId exists in database
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found" });
      }
      // Check if the user is sending a request to himself
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot send a request to yourself" });
      }
      // Check if the request already exists
      const existingRequest = await ConnectionRequests.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      // Check if the request already exists
      if (existingRequest) {
        return res.status(400).json({ message: "Request already exists" });
      }
      // Create a new request
      const newRequest = new ConnectionRequests({
        fromUserId,
        toUserId,
        status,
      });
      await newRequest.save();
      return res.status(200).json({
        message:
          status === "interested"
            ? `Request sent to ${toUser.firstName} ${toUser.lastName}`
            : `Request ignored by ${toUser.firstName} ${toUser.lastName}`,
        data: newRequest,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = { requestsRouter };
