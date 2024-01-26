const mongoose = require("mongoose");
const app = require("./app");

// console.log(process.env.DB_HOST);

const { DB_HOST, PORT = 3000 } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running");
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
