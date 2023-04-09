const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const messageRoutes = require("./message");
const chatRoutes = require("./chat");

router.use("/user", userRoutes);
router.use("/message", messageRoutes);
router.use("/chat", chatRoutes);

module.exports = router;
