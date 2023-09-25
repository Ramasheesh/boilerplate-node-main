const mongoose =  require('mongoose')

module.exports = {
  fullName: String,
  firstName: String,
  lastName: String,
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "role" },
  authType: {
    type: String,
    enum: ["email", "google", "facebook", "apple", "github", "phone"],
    default: "email",
  },
  email: String,
  password: String,
  status: {
    type: String,
    enum: ["pending", "active", "inactive", "deleted", "blocked"],
    default: "pending",
  },
  isEmailVerified: { type: Boolean, default: false },
  isTokenExpire: { type: Boolean, default: false },
  token: String,
  otp: String,
  lastLogin: Date,
};
