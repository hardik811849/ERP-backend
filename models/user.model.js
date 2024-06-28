const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  password: String,
  role: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
