// config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from the root directory
dotenv.config({ path: "../config.env" }); // Fix the path

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));