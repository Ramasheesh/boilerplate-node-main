const mongoose = require("mongoose");

module.exports = {
  fullName: String,
  firstName: String,
  lastName: String,
  // created by role
  createdBy: {
    type: String,
    enum: ["", "admin", "superAdmin", "manager"],
    default: "",
  },
  // role id
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
  },
  // profile of user
  currentProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
  },
  // profiles: [
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "profile",
    // },
  // ],
  authType: {
    type: String,
    enum: ["email", "google", "facebook", "apple", "github", "phone"],
    default: "email",
  },
  status: {
    type: String,
    enum: ["pending", "active", "inactive", "deleted", "blocked"],
    default: "pending",
  },
  email: String,
  password: String,
  isEmailVerified: { type: Boolean, default: false },
  isTokenExpire: { type: Boolean, default: false },
  token: String,
  otp: String,
  lastLogin: Date,
};
