const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const DBURL = process.env.DBURL;

const Connection = async () => {
  try {
    await mongoose.connect(DBURL);
    console.log("Database Connected");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process if unable to connect to the database
  }
};

module.exports = Connection;
