const userModel = require("../models/userModel");
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
    let { email, username, password } = req.body;

    let userExist = await userModel.findOne({ email });
    if (userExist) {
      req.flash("error", "User Already Registered With This Email");
      return res.redirect("/api/v1/user/register");
    }

    const newUser = new userModel({ email, username }); 

    const registeredUser = await newUser.save(); 

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Stock Management.");
      res.redirect("/");
    });
  } catch (error) {
    console.log(error.message);
    req.flash("error", "Something Went Wrong In Registering.");
    res.redirect("/api/v1/user/register"); 
  }
};
module.exports = {
  getLoginController,
  getRegisterController,
  registerController,
};

