const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  am: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  eduPersonAffiliation: {
    type: String,
    required: true,
  },
  eduPersonPrimaryAffiliation: {
    type: String,
  },
  mail: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
