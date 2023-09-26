const mongoose = require("mongoose");
module.exports = {
  name: String,
  fullAddress: {
    type: String,
    default: " ",
  },
  city: {
    type: String,
    default: " ",
  },
  state: String,
  country: String,
  zipCode: String,
  profileImage: String,
  profileType: {
    type: String,
    enum: ["driver", "customer"],
    default: "customer",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
};
