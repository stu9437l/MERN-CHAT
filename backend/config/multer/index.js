const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const userProfileUploda = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const fileExtension = "image/png" || "image/jpg" || "image/jpeg";
    if (file.mimetype === fileExtension) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Only image are allowed"));
    }
  },
});

module.exports = userProfileUploda;
