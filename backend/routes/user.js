const express = require("express");
const { CreateUser, Login, GetAllUsers } = require("../controller/user");
const { UserValidation } = require("../validation/user");
const userProfileUploda = require("../config/multer");
const { Authentication } = require("../middleware/auth");
const router = express.Router();

// private routes
router.get("/", Authentication, GetAllUsers);

//public routes

router.post("/register", userProfileUploda.single("picture"), CreateUser);
router.post("/login", Login);

module.exports = router;
