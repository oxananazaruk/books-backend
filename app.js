const express = require("express");
const moment = require("moment");
const fs = require("fs/promises");
const cors = require("cors");
const booksRouter = require("./routes/api/books.js");
// const mongoose = require("mongoose");

// const DB_HOST = "mongodb+srv://Oxana:oBemGbR9whNZ5Tud@cluster0.wm2gu6f.mongodb.net/books_books?retryWrites=true&w=majority"

// mongoose.set('strictQuery', true);


const app = express();

app.use(cors());
app.use(express.json());

app.set("json spaces", 4);

app.use(async (req, res, next) => {
  const { method, url } = req;
  const date = moment().format("DD-MM-YYYY_hh:mm:ss");
  await fs.appendFile("./public/server.log", `\n ${method} ${url} ${date}`);
  next();
});

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

// mongoose.connect(DB_HOST)
//     .then(() => { app.listen(3000) })
//     .catch(error => {
//         console.log(error.message);
//         process.exit(1);
//     });

module.exports = app;
