const express = require("express");
const moment = require("moment");
const fs = require("fs/promises");
const cors = require("cors");
require("dotenv").config();

const booksRouter = require("./routes/api/books.js");
const authRouter = require("./routes/api/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.set("json spaces", 4);

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  await fs.appendFile("./public/server.log", `\n ${method} ${url} ${date}`);
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);

app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
