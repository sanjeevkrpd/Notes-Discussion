const fileModel = require("../models/fileModel");

const aboutController = (req, res) => {
  res.render("pages/about.ejs");
};

const singleListingController = async (req, res) => {
  try {
    const { _id } = req.params;
    let data = await DataModel.findById(_id);

    if (!data) {
      res.status(500).send({
        success: false,
        message: "Oops! Data Not Found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Data Found Successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Finding Data",
      error,
    });
  }
};

const searchController = async (req, res) => {
  try {
    const searchResults = await fileModel.find({
      title: { $regex: new RegExp(req.body.title, "i") },
    });

    if (searchResults.length === 0) {
      // Checking if searchResults is an empty array
      req.flash(
        "error",
        "Search Result is not found. Please modify the search."
      );
      return res.redirect("/");
    }

    req.flash("success", "Search results found.");
    res.render("pages/search.ejs", { searchResults });
  } catch (error) {
    console.log(error);
    req.flash("error", "Something went wrong.");
    res.redirect("/api/v1/user/login");
  }
};

module.exports = { aboutController, singleListingController, searchController };
