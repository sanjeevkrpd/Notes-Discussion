const User = require("../models/userModel");
const passport = require("passport");
// render login form
const getLoginController = (req, res) => {
  res.render("pages/login.ejs");
};

// render register form

const getRegisterController = (req, res) => {
  res.render("pages/register.ejs");
};

// register controller

const registerController = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const validUser = await User.findOne({ email: req.body.email });

    if (validUser) {
      req.flash("error", "User Already Registered.");
      res.redirect("/api/v1/user/login");
    }

    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Welcome to the WanderLust");
      res.redirect("/");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/api/v1/user/register");
  }
};
module.exports = {
  getLoginController,
  getRegisterController,
  registerController,
};
