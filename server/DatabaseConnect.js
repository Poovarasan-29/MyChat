const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected... ");
  } catch (error) {
    console.log("DB connection Error... ",error);
    process.exit(1);
  }
}

module.exports = connectDB;
