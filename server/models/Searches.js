const mongoose = require("mongoose");

const SearchesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  searchHistory: [String],
});

module.exports = mongoose.model("Searches", SearchesSchema);
