const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Searches = require("../models/Searches");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "/.env" });
const verify = require("./verifyToken");
const mongoose = require("mongoose");

// get posts
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page);
  const limit = 5;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
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
    results.posts = await Post.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "p_id",
          as: "comments",
        },
      },
      {
        $set: {
          comments: { $size: "$comments" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);

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

//posts filtering by semester, course
router.get("/filter/results", async (req, res) => {
  semesters = req.query.semester;
  const courses = req.query.course;
  
  var FilterdPosts;
  try {
    if(courses==undefined){
      FilterdPosts = await Post.find({ semester: { $in: semesters } });
    }else{
      FilterdPosts = await Post.find({ course: { $in: courses } });
    }
    
    res.json(FilterdPosts);
    
  } catch (error) {
    res.json({ message: error });
  }
});

router.get("/test", verify, async (req, res) => {
  res.json(req.useruid.uid);
});

router.get("/search/results", async (req, res) => {
  const searchParams = req.query.search;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const useruid = req.query.user;

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
    results.posts = await Post.aggregate([
      {
        $match: {
          $text: { $search: `${searchParams}` },
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "p_id",
          as: "comments",
        },
      },
      {
        $set: {
          comments: { $size: "$comments" },
        },
      },
      {
        $sort: { score: { $meta: "textScore" } },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: limit,
      },
    ]);

    if (useruid !== "null") {
      await Searches.findOneAndUpdate(
        {
          user: useruid,
        },
        {
          $addToSet: {
            searchHistory: searchParams,
          },
        }
      );
    }

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
