const Posts = require("../models/post");

const addData = async (req, res) => {
  try {
    const { ref, id, patha, postData, userAgent } = req.body;

    // create a new post with data from the req body

    const newPost = new Posts({
      ref,
      id,
      patha,
      postDate,
      userAgent,
    });

    // save h=the  new post in the database
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: "Failed to add post data", error });
  }
};
const getData = async (req, res) => {
  try {
    // fetch all the posts from the database
    const posts = await Posts.find();
    // send the fetched posts ddata as the resposnese
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve post data", error: error.message });
  }
};

module.exports = { addData, getData };
