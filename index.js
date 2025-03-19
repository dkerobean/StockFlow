const express = require("express");
const app = express();
const path = require("path");
const route = require("./Routes/routes");
const ejs = require("ejs").__express;
const fs = require("fs");
var https = require("https");
const mongoose = require("mongoose"); // Import Mongoose
const dotenv = require("dotenv");

require("./config/db");

// Load environment variables
dotenv.config({ path: "./config.env" });

// MongoDB Connection
const DB = process.env.DATABASE; // Use the online MongoDB connection string
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

const PORT = process.env.PORT || 3001;

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.engine("ejs", ejs);

app.set("layout", "layout");

// Serve static files
app.use(express.static(__dirname + "/public"));

// Routes
app.use("/", route);

// For deployment use
// https
//   .createServer(
//     {
//       key: fs.readFileSync("sslcert/ssl.key"),
//       cert: fs.readFileSync("sslcert/ssl.cert"),
//     },
//     app
//   )
//   .listen(PORT, function () {
//     console.log(
//       "Server is up and running on port number " + PORT + " for Https"
//     );
//   });

// For Development use
const http = require("http").createServer(app);
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));