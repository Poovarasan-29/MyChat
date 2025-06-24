const ContactModel = require("../models/ContactModel");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

const router = require("express").Router();

// MIDDLEWARES

async function hashPassword(req, res, next) {
  const salt = 10;
  const { name, phoneNo, password } = req.body;

  // Check the inputs is Valid
  if (name.length == 0 || phoneNo.length != 10 || password.length < 8)
    return res.status(400).json({ message: "Invalid user inputs" });

  // Check the user is Already Exists
  const userExist = await UserModel.findOne({ phoneNo });
  if (userExist)
    return res
      .status(309)
      .json({ message: "User Already Exists Go to Sign In" });

  // Generate Hhash password
  const hashPassword = await bcrypt.hash(password, salt);
  req.body.hashPassword = hashPassword;
  next();
}

// POST ROUTERS

router.post("/sign-up", hashPassword, async (req, res) => {
  const { name, phoneNo, hashPassword } = req.body;

  try {
    await UserModel.insertOne({ name, phoneNo, password: hashPassword });
    res.status(201).json({ message: "User Created" });
  } catch (error) {
    res.status(500).json({ message: "Server Error Retry" });
  }
});

router.post("/sign-in", async (req, res) => {
  const { phoneNo, password } = req.body;

  if (phoneNo.length != 10 || password.length < 8)
    return res.status(400).json({ message: "Invalid user Inputs" });

  // Get the User
  const user = await UserModel.findOne({ phoneNo });
  if (!user)
    return res.status(404).json({ message: "User not Found. Please Sign up" });

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (isPasswordMatch)
    return res.status(200).json({ message: "User Found", user });

  res.status(401).json({ message: "Invalid Credentials" });
});

// GET ROUTERS

router.get("/get-user-contacts/:phoneNo", async (req, res) => {
  const { phoneNo } = req.params;
  if (phoneNo.length != 10 || isNaN(phoneNo)) {
    return res.status(400).json({ message: "Invalid Data" });
  }

  try {
    const isUserValid = await UserModel.findOne({ phoneNo });
    if (!isUserValid) {
      return res
        .status(400)
        .json({ message: "User Not Found. Please SignUp!" });
    }

    const contactList = await ContactModel.findOne({ userContact: phoneNo });
    if (!contactList) {
      return res.status(200).json({ message: "No Contacts" });
    }

    const contactsUserDetails = await UserModel.find(
      {
        phoneNo: { $in: contactList.contacts },
      },
      { name: 1, phoneNo: 1, _id: 0 }
    );

    return res.status(200).json({
      contacts: contactsUserDetails,
      message: "Contacts Retrived",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
