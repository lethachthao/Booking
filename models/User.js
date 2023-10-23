const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const ModelUser = mongoose.model("User", userSchema);

module.exports = ModelUser;
