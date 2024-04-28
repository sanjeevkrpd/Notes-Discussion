if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const ejs = require("ejs");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const userRoute = require("./routers/userRouter");
const listingRoute = require("./routers/listingRoute");
const User = require("./models/userModel");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const File = require("./models/fileModel");
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
const MONGODB_URL = process.env.MONGODB_URL;
mongoose
  .connect(MONGODB_URL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Session store
const store = MongoStore.create({
  mongoUrl: MONGODB_URL,
  crypto: {
    secret: process.env.MY_SUPER_SECRET_CODE || "thisissupersecretcode",
  },
  touchAfter: 24 * 3600,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

store.on("error", (err) => {
  console.log("Error in Mongo Session Store", err);
});

// Session middleware
const sessionOption = {
  store,
  secret: process.env.MY_SUPER_SECRET_CODE || "thisissupersecretcode",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to set flash messages
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// View engine setup
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// Method override middleware
app.use(methodOverride("_method"));

// Routes
app.use("/api/v1/listing", listingRoute);
app.use("/api/v1/user", userRoute);

// Default route
app.get("/", async (req, res) => {
  let data = await File.find({});
  res.render("pages/index.ejs", { data });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
