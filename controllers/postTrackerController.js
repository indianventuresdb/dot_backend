const Posts = require("../models/post");

const addData = async (req, res) => {
  try {
    console.log("request body", req.body);
    const { ref, id, path, postDate, userAgent } = req.body;

    const newPost = await Posts.create({
      ref,
      id,
      path,
      postDate,
      userAgent,
    });

    // const savedPost = await newPost.();

    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add post data", error: error.message });
  }
};

const getData = async (req, res) => {
  try {
    const posts = await Posts.find();

    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve post data", error: error.message });
  }
};

module.exports = { addData, getData };
