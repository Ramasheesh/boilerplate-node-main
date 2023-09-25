module.exports = {
  name: String,
  roleType: {
    type: String,
    enum: ["user", "admin", "superAdmin", "manager"],
    default: "",
  },
};
