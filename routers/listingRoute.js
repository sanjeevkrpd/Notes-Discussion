const express = require("express");
const {
  aboutController,
  singleListingController,
  searchController
} = require("../controllers/listingCtrl");
const router = express.Router();

//get method
router.get("/about", aboutController);

// single listing controller
router.get("/:id", singleListingController);

//search
router.post("/search", searchController);

module.exports = router;
