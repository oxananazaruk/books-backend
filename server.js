const mongoose = require("mongoose");
const app = require("./app");

const DB_HOST = "mongodb+srv://Oxana:oBemGbR9whNZ5Tud@cluster0.wm2gu6f.mongodb.net/books_books?retryWrites=true&w=majority"

mongoose.connect(DB_HOST)
    .then(() => {app.listen(3000, () => console.log("Server running"))})
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    });
