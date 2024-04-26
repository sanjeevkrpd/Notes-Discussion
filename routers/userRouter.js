const express = require("express");
const {
  getLoginController,
  getRegisterController,
  registerController,
} = require("../controllers/userCtrl");
const passport = require("passport");

// router object
const router = express.Router();

// get login
router.get("/login", getLoginController);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/api/v1/user/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to Notes Discussion");
    res.redirect("/");
  }
);

// get register
router.get("/register", getRegisterController);
// post register
router.post("/register", registerController);

module.exports = router;
