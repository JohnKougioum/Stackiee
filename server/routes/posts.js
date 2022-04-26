const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/.env" });
const verify = require("./verifyToken");

// get posts
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 5;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    // const posts = await Post.find();
    const results = {};

    if (endIndex < (await Post.countDocuments()))
      results.next = {
        page: page + 1,
        limit: limit,
      };

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.posts = await Post.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ $natural: -1 });
    res.json(results);
  } catch (err) {
    res.json({ message: err });
  }
});

// get specific post
router.get("/:pid", async (req, res) => {
  try {
    const Specpost = await Post.findById({ _id: req.params.pid });
    res.json(Specpost);
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/test", verify, async (req, res) => {
  res.json(req.useruid.uid);
});

router.get("/search/results", async (req, res) => {
  const searchParams = req.query.search;
  const page = parseInt(req.query.page);
  const limit = 5;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // const posts = await Post.find();
  const results = {};

  if (
    endIndex <
    (await Post.countDocuments({ $text: { $search: `${searchParams}` } }))
  )
    results.next = {
      page: page + 1,
      limit: limit,
    };

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  try {
    results.posts = await Post.find(
      {
        $text: { $search: `${searchParams}` },
      },
      { score: { $meta: "textScore" } }
    )
      .skip(startIndex)
      .limit(limit)
      .sort({ score: { $meta: "textScore" } });
    res.json(results);
  } catch (error) {
    console.log(error);
  }
});

//new post();
router.post("/", verify, async (req, res) => {
  const post = new Post({
    user: req.useruid.uid,
    title: req.body.new_post.title,
    body: req.body.new_post.body,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (error) {
    console.log(error);
  }
  res.status(201).send();
});

router.delete("/:user", async (req, res) => {
  try {
    const removePost = await Post.deleteOne({ user: req.params.user });
    res.json(removePost);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
