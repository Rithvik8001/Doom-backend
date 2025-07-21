const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestsRouter } = require("./routes/requests");
const { userRouter } = require("./routes/user");
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);

// Database connection and listen to the port 3001.
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3001, () => {
      console.log("Server is successfully listening on port 3001");
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
