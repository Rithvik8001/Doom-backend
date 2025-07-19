const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const { authRouter } = require("./routes/auth");
app.use(express.json());
require("dotenv").config();

app.use("/", authRouter);

// Database connection and listen to the port 3001.
connectDB().then(() => {
  console.log("Database connected");
  app.listen(3001, () => {
    console.log("Server is successfully listening on port 3001");
  });
});
