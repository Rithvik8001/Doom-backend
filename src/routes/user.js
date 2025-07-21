const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const userRouter = express.Router();
const { ConnectionRequests } = require("../models/connectionRequests");
const { User } = require("../models/user");
const safeUserData = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "about",
  "skills",
];

// Get all the pending connections of the logged in user
userRouter.get("/api/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const receivedRequests = await ConnectionRequests.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", safeUserData);

    return res.status(200).json({
      message: "Received requests fetched successfully",
      receivedRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// get all the accepted connections of the logged in user

userRouter.get("/api/user/connections/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    // find the accepted connections of the logged in user.
    const acceptedConnections = await ConnectionRequests.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", safeUserData)
      .populate("toUserId", safeUserData);

    // map the accepted connections to the logged in user.
    const data = acceptedConnections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    return res.status(200).json({
      message: "Accepted connections fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// get the feed of the logged in user
userRouter.get("/api/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 10 ? 10 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequests.find({
      $or: [{ toUserId: loggedInUser }, { fromUserId: loggedInUser }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });

    const feed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser } },
      ],
    })
      .select(safeUserData)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "Feed fetched successfully",
      feed,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});
module.exports = { userRouter };
