const express = require("express");
const bcrypt = require("bcrypt");
const { fail, success } = require("../utils/constants");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
require("dotenv").config();

// User login
authRouter.post("/login", async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password) {
      return fail(res, "UserId and Password are required.");
    }
    if (!role) {
      return fail(res, "Role is required.");
    }

    const user = await UserModel.findOne({ userId, role });

    if (!user) {
      return fail(res, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return fail(res, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.userId, name: user.name },
      process.env.SECRET_KEY,
      { expiresIn: "3h" }
    );

    return success(res, "Login successfully", token);
  } catch (error) {
    return fail(res, error.message);
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const { userId, name, email, password, role } = req.body;

    if (!userId || !name || !password || !email) {
      return fail(res, "UserId, Name, Email and Password are required.");
    }
    if (!role) {
      return fail(res, "Role is required.");
    }

    const existingUser = await UserModel.findOne({ userId, role });
    if (existingUser) {
      return fail(res, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      userId,
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    return success(res, "User registered successfully");
  } catch (error) {
    return fail(res, error.message);
  }
});

module.exports = {
  authRouter,
};
