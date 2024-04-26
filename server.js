if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const dotenv = require("dotenv");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const MongoStore = require("connect-mongo");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Import the Strategy object
const flash = require("connect-flash");
const userRouter = require("./routers/userRouter");
const listingRoute = require("./routers/listingRoute");
const User = require("./models/userModel");
const File = require("./models/fileModel");
const mongoose = require("mongoose");
const app = express();

// Configuration
dotenv.config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = process.env.MONGO_DB; // "mongodb://127.0.0.1:27017/NotesDiscussion";
//process.env.MONGO_DB;
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
// Session store
const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET_CODE,
  },
  touchAfter: 24 * 3600,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

store.on("error", (err) => {
  console.log("Error in Mongo Session Store", err);
});
app.use(
  session({
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update to new Date()
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport middleware to manage user authentication
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set flash messages
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// View engine setup
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/listing", listingRoute);

// Default route
app.get("/", async (req, res) => {
  let data = await File.find({});
  res.render("pages/index.ejs", { data }); // Passing flash message directly to render function
});

// Server
const port = process.env.PORT; // Default to port 3000 if PORT is not defined in .env
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
