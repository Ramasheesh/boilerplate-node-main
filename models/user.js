const mongoose = require("mongoose");

module.exports = {
  fullName:{type: String},
  firstName: {type: String},
  lastName: {type: String},
  // created by role
  createdBy: {
    type: String,
    enum: ["self", "admin", "superAdmin", "manager"],
    default: "self",
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
  profiles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
  ],
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
  bookmarks:[
    {bookMarkById : {type : mongoose.Types.ObjectId , ref: "user" }},
    { bookMarkToId : {type: mongoose.Types.ObjectId , ref: "user"}},
    {status: {type: String , enum: ["active" , "inActive","pending"],default: "pending"}},
  ], 
  email:{type: String},
  password: {type: String},
  profileImageUrl: {type: String},
  isEmailVerified: { type: Boolean, default: false },
  isTokenExpire: { type: Boolean, default: false },
  token: {type: String},
  otp: {type: String},
  lastLogin: Date,
  
};
