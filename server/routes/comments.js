const express = require("express");
const router = express.Router();
const Comments = require("../models/Comment");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/.env" });
const verify = require("./verifyToken");

// GET POST'S COMMENT
router.get("/:pid", async (req, res) => {
  try {
    const comment = await Comments.find({ p_id: req.params.pid });
    res.json(comment);
  } catch (err) {
    res.json({ message: err });
  }
});

// NEW COMMENT;
router.post("/", verify, async (req, res) => {
  console.log(req.body);
  const comment = new Comments({
    user: req.useruid.uid,
    body: req.body.body,
    p_id: req.body.p_id
  });

  try {
    const savedComment = await comment.save();
    res.json(savedComment);
  } catch (error) {
    console.log(error);
  }
  res.status(201).send();
});

module.exports = router;
