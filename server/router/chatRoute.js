const ChatModel = require("../models/ChatModel");
const UserModel = require("../models/UserModel");

const router = require("express").Router();

async function checkUsers(req, res, next) {
  const { senderPhone, receiverPhone } = req.query;
  // console.log(senderPhone, receiverPhone);

  const users = await UserModel.find({
    phoneNo: { $in: [senderPhone, receiverPhone] },
  });
  if (users.length != 2)
    return res.status(404).json({ message: "User Details Missing" });

  next();
}

router.get("/get-user-chat", checkUsers, async (req, res) => {
  const { senderPhone: A, receiverPhone: B } = req.query;

  const chats = await ChatModel.find({
    $or: [
      { sender: A, receiver: B },
      { sender: B, receiver: A },
    ],
  }).sort({ timestamp: 1 });
  return res.status(200).json({ chats });
});

router.post("/save-message", checkUsers, async (req, res) => {
  const { senderPhone: A, receiverPhone: B, message } = req.query;

  await ChatModel.insertOne({ sender: A, receiver: B, message });

  res.status(201).json({ message: "Message Saved" });
});

module.exports = router;
