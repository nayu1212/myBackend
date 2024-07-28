const express = require("express");
const bcryptjs = require("bcryptjs");
const AdminData = require("../database/adminUser");
const authAdminRouter = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Sign Up
authAdminRouter.post("/api/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with same email already exists!" });
    }

    const hashedPassword = await bcryptjs.hash(password, 8);

    let user = new AdminData({
      email,
      password: hashedPassword,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    console.error('Error in /api/signup:', e);
    res.status(500).json({ error: e.message });
  }
});


// Sign In

authAdminRouter.post("/api/admin/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await AdminData.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");
    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

authAdminRouter.post("/admin/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await AdminData.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user data
authAdminRouter.get("/", auth, async (req, res) => {
  const user = await AdminData.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});

module.exports = authAdminRouter;