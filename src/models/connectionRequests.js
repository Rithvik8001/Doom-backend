const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    // The user who is sending the request
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // The user who is receiving the request
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    // The status of the request
    status: {
      type: String,
      // enum is used to restrict the values that can be assigned to the status field.
      enum: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is not a valid status`,
      required: true,
    },
  },
  { timestamps: true }
);

const ConnectionRequests = mongoose.model(
  "ConnectionRequests",
  connectionRequestSchema
);

module.exports = { ConnectionRequests };
