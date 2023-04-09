const express = require("express");
const {
  CreateSingleChat,
  getAllChatofLoginUser,
  createGroupChat,
  RemoveUserFromGroup,
  RenameGroupName,
  DeleteGroup,
} = require("../controller/chat");
const { Authentication } = require("../middleware/auth");
const router = express.Router();

router.post("/create", Authentication, CreateSingleChat);
router.get("/", Authentication, getAllChatofLoginUser);
router.post("/group", Authentication, createGroupChat);
router.put("/remove", Authentication, RemoveUserFromGroup);
router.put("/rename", Authentication, RenameGroupName);
router.delete("/delete", Authentication, DeleteGroup);

module.exports = router;
