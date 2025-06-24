const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  sender: {
    required: true,
    type: String,
  },
  receiver: {
    required: true,
    type: String,
  },
  message: {
    required: true,
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatModel = mongoose.model("chat", ChatSchema);
module.exports = ChatModel;
