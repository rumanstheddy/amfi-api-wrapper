require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const amfiRouter = require("./routes/amfi");
app.use("/api/amfi", amfiRouter);

app.get("/", (req, res) => {
  res.send("Express server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
