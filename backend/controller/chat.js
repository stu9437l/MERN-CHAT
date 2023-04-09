const { json } = require("body-parser");
const ChatModel = require("../model/chat");
const UserModel = require("../model/user");
const { findById } = require("../model/message");

const CreateSingleChat = async (req, res, next) => {
  const { userId } = req.body;
  let isChat = await ChatModel.findOne({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } },
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await UserModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email picture",
  });
  if (isChat) {
    return res.send(isChat);
  }
  try {
    const newChat = await ChatModel.create({
      chatName: "sender",
      isGroupChat: false,
      users: [userId, req.user._id],
    });

    const createdChat = await ChatModel.findById(newChat._id).populate(
      "users",
      "-password -__v"
    );

    res.status(200).json({
      createdChat,
    });
  } catch (err) {
    next({
      message: "create chat failed",
    });
  }
};
const getAllChatofLoginUser = async (req, res, next) => {
  try {
    let chats = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password -__v")
      .populate("latestMessage")
      .populate("groupAdmin");

    chats = await UserModel.populate(chats, {
      path: "latestMessage.sender",
      select: "name email picture",
    });
    if (chats.length < 1) {
      return next({
        message: "no chat found",
      });
    }
    return res.status(200).json({ chats });
  } catch (err) {
    next({
      message: "get all login user message found failed",
    });
  }
};

const createGroupChat = async (req, res, next) => {
  const { chatName, users } = req.body;
  if (users.length < 2) {
    return next({
      message: "To create a group chat min 2 members needed",
    });
  }
  users.push(req.user._id);
  console.log(users);

  try {
    const newGroupChat = await ChatModel.create({
      chatName,
      users: users,
      groupAdmin: req.user,
      isGroupChat: true,
    });
    const groupChat = await ChatModel.findById(newGroupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(groupChat);
  } catch (err) {
    next({
      message: "Create group failed",
    });
  }
};

const RemoveUserFromGroup = async (req, res, next) => {
  const { userId, chatId } = req.body;

  //checking current user admin or not
  const chat = await ChatModel.findOne({
    $and: [{ _id: chatId }, { groupAdmin: { $eq: req.user._id } }],
  });
  if (!chat) {
    next({
      status: 404,
      message: "Group admin only remove user",
    });
  }

  //check user is in group or not

  const checkUser = chat && chat.users.includes(userId);
  if (!checkUser) {
    return next({
      message: "user not in group",
    });
  }

  //upated group chat with removing new user
  try {
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          users: userId,
        },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin");
    return res.status(200).json(updatedChat);
  } catch (err) {
    next({
      message: "Remove user from group failed",
    });
  }
};

const RenameGroupName = async (req, res, next) => {
  const { chatName, chatId } = req.body;
  //checking current user admin or not
  const chat = await ChatModel.findOne({
    $and: [{ _id: chatId }, { groupAdmin: { $eq: req.user._id } }],
  });
  if (!chat) {
    next({
      status: 404,
      message: "admin only rename the group name",
    });
  }
  try {
    const updateGroupName = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin");
    return res.status(200).json(updateGroupName);
  } catch (err) {
    next({
      message: "Change group name failed",
    });
  }
};

const DeleteGroup = async (req, res, next) => {
  const { chatId } = req.body;
  //checking current user admin or not
  const chat = await ChatModel.findOne({
    $and: [{ _id: chatId }, { groupAdmin: { $eq: req.user._id } }],
  });
  if (!chat) {
    return next({
      status: 404,
      message: "admin only rename the group name",
    });
  }
  const deleteGroup = await ChatModel.findByIdAndDelete(chatId);
  if (!deleteGroup) {
    return next({
      message: "No group found",
    });
  }
  return res.status(200).json({
    deleteGroup,
  });
};

module.exports = {
  CreateSingleChat,
  getAllChatofLoginUser,
  createGroupChat,
  RemoveUserFromGroup,
  RenameGroupName,
  DeleteGroup,
};
