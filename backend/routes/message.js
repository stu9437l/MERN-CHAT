const express = require("express");
const { CreateMessage, getAllMessageofChat } = require("../controller/message");
const { Authentication } = require("../middleware/auth");

const router = express.Router();

router.post("/create", Authentication, CreateMessage);
router.get("/:chatId", Authentication, getAllMessageofChat);

module.exports = router;
