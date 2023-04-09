const ChatModel = require("../model/chat");
const MessageModel = require("../model/message");
const UserModel = require("../model/user");

const CreateMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  try {
    let message = await MessageModel.create({
      content,
      sender: req.user._id,
      chat: chatId,
    });
    message = await MessageModel.findById({ _id: message._id })
      .populate("sender", "-password")
      .populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.users",
      select: "name email picture",
    });
    message = await UserModel.populate(message, {
      path: "chat.groupAdmin",
      select: "name email picture",
    });
    await ChatModel.findByIdAndUpdate(
      chatId,
      {
        latestMessage: message,
      },
      { new: true }
    );
    return res.status(200).json({ message });
  } catch (err) {
    next({
      message: "create a message failed",
    });
  }
};

const getAllMessageofChat = async (req, res, next) => {
  const { chatId } = req.params;
  try {
    let allMessages = await MessageModel.find({ chat: chatId })
      .populate("sender", "name picture")
      .populate("chat");
    allMessages = await UserModel.populate(allMessages, {
      path: "chat.users",
      select: "name email password",
    });

    if (allMessages.length < 1) {
      return next({
        message: "No message found",
      });
    }
    return res.status(200).json({
      allMessages,
    });
  } catch (err) {
    next({
      message: "Failed to get all message",
    });
  }
};

module.exports = {
  CreateMessage,
  getAllMessageofChat,
};
