// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3001;
const connectDB = require("./DatabaseConnect");
dotenv.config();
const signUpRoute = require("./router/signUpRoute");
const contactRoute = require("./router/contactRoute");
const chatRoute = require("./router/chatRoute");
const ChatModel = require("./models/ChatModel");
const ContactModel = require("./models/ContactModel");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use(cors());
// Enable CORS in Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN, // Allow this frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", (userPhone) => {
    socket.join(userPhone);
  });

  socket.on("send-msg", async (msg) => {
    try {
      const { sender, receiver, message, timestamp } = msg;
      const savedMsg = await ChatModel.create({
        sender,
        receiver,
        message,
        timestamp: timestamp || new Date(),
      });

      const isReceiverNotInSenderContact = await ContactModel.findOne({
        userContact: receiver,
      });

      if (!isReceiverNotInSenderContact) {
        await ContactModel.insertOne({
          userContact: receiver,
          contacts: [sender],
        });
      }

      if (!isReceiverNotInSenderContact?.contacts.includes(sender)) {
        isReceiverNotInSenderContact.contacts.push(sender);
        await isReceiverNotInSenderContact.save();
      }

      io.to(receiver).emit("receive-msg", savedMsg);
      // io.to(sender).emit("receive-msg", msg);
    } catch (error) {}
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

//Routers
app.use(signUpRoute);
app.use(contactRoute);
app.use(chatRoute);
app.get("/", () => {
  console.log("Server Running.");
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
