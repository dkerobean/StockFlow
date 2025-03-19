const express = require("express");
const app = express();
const path = require("path");
const route = require("./Routes/routes");
const ejs = require("ejs").__express;
const fs = require("fs");
var https = require("https");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require('express-session');
const cookieParser = require('cookie-parser');

require("./config/db");

// Load environment variables
dotenv.config({ path: "./config.env" });

// MongoDB Connection
const DB = process.env.DATABASE;
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

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

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