const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  semester: {
    type: Number,
    required: [true, "semester is required"],
  },
  image: {
    filename: String,
    url: String,
  },
  pdf: {
    type: String,
    required: [true, "pdf is required"],
  },
});

const File = mongoose.model("File", courseSchema);

module.exports = File;
