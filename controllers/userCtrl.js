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
      return res.redirect("/api/v1/user/login"); // Add return statement here
    }

    let newUser = new User({ email, username });
    let registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // Add return statement here
      }
      req.flash("success", "Welcome to the WanderLust");
      return res.redirect("/"); // Add return statement here
    });
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/api/v1/user/register"); // Add return statement here
  }
};

module.exports = {
  getLoginController,
  getRegisterController,
  registerController,
};
