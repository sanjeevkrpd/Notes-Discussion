const express = require("express");
const { isLoggedIn } = require("../middleware");
const {
  aboutController,
  singleListingController,
  searchController,
} = require("../controllers/listingCtrl");
const router = express.Router();

//get method
router.get("/about", isLoggedIn, aboutController);

// single listing controller

//search
router.post("/search", searchController);

module.exports = router;
