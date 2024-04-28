const mongoose = require("mongoose");
const Data = require("./data.js");
const Listing = require("../models/fileModel.js");

const MONGO_URL = process.env.MONGO_URL;
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();

    await mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (err) {
    console.error(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});

    await Listing.insertMany(Data);

    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};

// Call the main function to connect, initialize data, and disconnect
main();
