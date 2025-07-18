const express = require("express");
const app = express();

app.use("/api", (req, res) => {
  res.send("Hello World from the server");
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
