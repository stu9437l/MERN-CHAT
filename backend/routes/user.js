const express = require("express");
const { CreateUser, Login, GetAllUsers } = require("../controller/user");
const { UserValidation } = require("../validation/user");
const userProfileUploda = require("../config/multer");
const { Authentication } = require("../middleware/auth");
const router = express.Router();
router.get("/", Authentication, GetAllUsers);
router.post("/register", userProfileUploda.single("picture"), CreateUser);
router.post("/login", Login);

module.exports = router;
