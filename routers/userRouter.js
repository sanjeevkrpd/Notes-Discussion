const express = require("express");
const { isLoggedIn } = require("../middleware");
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
// get logout
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Good Bye. You're logged Out!");
    res.redirect("/");
  });
});
// get register
router.get("/register", getRegisterController);




// post login
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


// post register
router.post("/register", registerController);



module.exports = router;
