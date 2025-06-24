const ContactModel = require("../models/ContactModel");
const UserModel = require("../models/UserModel");
const router = require("express").Router();

router.post("/new-contact", async (req, res) => {
  const { userContact, newContact } = req.body;
  // console.log(userContact, newContact);

  if (userContact.length !== 10 || newContact.length !== 10) {
    return res.status(400).json({ message: "Invalid user inputs" });
  }

  try {
    const usersExist = await UserModel.find({
      phoneNo: { $in: [userContact, newContact] },
    });

    if (usersExist.length !== 2) {
      return res.status(404).json({ message: "User Not Found in MyChat" });
    }

    let user = await ContactModel.findOne({ userContact });
    // console.log(user);

    if (!user) {
      const newEntry = new ContactModel({
        userContact,
        contacts: [newContact],
      });
      await newEntry.save();
      return res.status(201).json({ message: "Contact Added" });
    } else {
      if (!user.contacts.includes(newContact)) {
        user.contacts.push(newContact);
        await user.save();
        return res.status(201).json({ message: "Contact Added" });
      }
      return res.status(409).json({ message: "Contact already exists" });
    }
  } catch (error) {
    console.error("Error in /new-contact:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
