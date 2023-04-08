const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const ATLAS_URI = process.env.ATLAS_URI;
const LOCAL_URI = process.env.LOCAL_URI;

const DBConnection = () => {
  mongoose
    .connect(ATLAS_URI)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database connection error" + err);
    });
};

module.exports = DBConnection;
