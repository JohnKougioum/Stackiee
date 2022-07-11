const express = require("express");
const router = express.Router();
const Searches = require("../models/Searches");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/.env" });
// const verify = require("./verifyToken");

router.get("/", async (req, res) => {
  try {
    const history = await Searches.find();
    res.json(history);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/", async (req, res) => {
  await Searches.deleteOne({ user: "it185201" });
});

module.exports = router;
