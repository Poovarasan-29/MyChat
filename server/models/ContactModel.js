const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  userContact: {
    type: String,
    required: true,
    maxLength: 10,
    minLength: 10,
  },
  contacts: {
    type: [{ type: String, maxLength: 10, minLength: 10 }],
  },
});

const ContactModel = mongoose.model("contact", ContactSchema);

module.exports = ContactModel;
