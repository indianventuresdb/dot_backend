const Posts = require("../models/post");

// Controller to handle adding new post data
const addData = async (req, res) => {
  try {
    const { ref, id, patha, postDate, userAgent } = req.body;

    // Create a new post instance with data from the request body
    const newPost = new Posts({
      ref,
      id,
      patha,
      postDate,
      userAgent,
    });

    // Save the new post to the database
    const savedPost = await newPost.save();

    // Send the saved post data as the response
    res.status(201).json(savedPost);
  } catch (error) {
    // Handle any errors that occurred during the process
    res
      .status(500)
      .json({ message: "Failed to add post data", error: error.message });
  }
};

// Controller to handle retrieving post data
const getData = async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Posts.find();

    // Send the fetched posts data as the response
    res.status(200).json(posts);
  } catch (error) {
    // Handle any errors that occurred during the process
    res
      .status(500)
      .json({ message: "Failed to retrieve post data", error: error.message });
  }
};

module.exports = { addData, getData };
