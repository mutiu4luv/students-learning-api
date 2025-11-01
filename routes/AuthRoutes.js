const router = require("express").Router();

const bcrypt = require("bcryptjs");
const User = require("../models/User");

// /registering a new student
router.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    const userExist = await User.findOne({
      email,
    });
    if (userExist) {
      return res.status(409).json({ error: "User already exists." });
    }

    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    });

    //save user and respond
    const user = await newUser.save();

    res.status(200).json({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

/////login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid User" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Password doesn't match" });
    }

    res.status(200).json({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,

      isAdmin: user.isAdmin,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
//LOGIN
router.post("/logins", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json({
      // token: generateToken(user._id),
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/delete/:id", async (req, res) => {
  try {
    const subject = await User.findByIdAndDelete(req.params.id);
    if (subject) {
      res.status(200).json({ message: "User has been deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's current class
    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    await user.save();

    res.json({ message: "User Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
////////
module.exports = router;
