module.exports = {
  name: {
    type: String,
    enum: ["user", "admin", "superAdmin", "manager"],
    default: "manager",
  },
};
