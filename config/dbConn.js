require("dotenv").config();
const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/JWT";
const dbConn = () => {
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = dbConn;
