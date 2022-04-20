const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const PostSchema = new mongoose.Schema({
  p_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  user: {
    type: String,
    required: true,
    ref: "User",
  },
  createtAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

PostSchema.index({ title: "text", body: "text" });

module.exports = mongoose.model("Post", PostSchema);
