const { default: mongoose } = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    toJSON: {
      transform: function (db, obj) {
        delete obj.__v;
        return obj;
      },
    },
    timestamps: true,
  }
);

const MessageModel = mongoose.model("Message", MessageSchema);
module.exports = MessageModel;
