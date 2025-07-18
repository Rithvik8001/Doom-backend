const express = require("express");
const app = express();
const { connectDB } = require("./config/database");

app.use("/api/users", (req, res) => {
  res.send("Hello World from the users route");
});

app.use("/api/users/:id", (req, res) => {
  res.send(`Hello World from the users route with id ${req.params.id}`);
});

app.use("/api", (req, res) => {
  res.send("Hello World from the server");
});

// Database connection and listen to the port 3001.
connectDB().then(() => {
  console.log("MongoDB connected");
  app.listen(3001, () => {
    console.log("Server is successfully listening on port 3001");
  });
});
