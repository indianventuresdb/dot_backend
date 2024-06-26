const { Posts } = require("../models/post");

const addData = async (req, res) => {
  let userAgent;

  try {
    userAgent = req.get("User-Agent");
    const { ref, id, path, postDate } = req.body;

    const post = await Posts.findOne({ id });

    console.log(post);

    if (post) {
      const update = await Posts.findByIdAndUpdate(
        post._id,
        { $inc: { visitors: 1 } },
        { new: true }
      );

      if (!update) {
        return res.status(300).json({ message: "Post counter not updated." });
      }
      return res
        .status(200)
        .json({ message: "Post counter updated.", post: update });
    }

    const newPost = await Posts.create({
      ref,
      id,
      path,
      postDate,
      userAgent,
    });

    res.status(201).json({ newPost, userAgent });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to add post data",
      error: error.message,
      userAgent,
    });
  }
};

const getData = async (req, res) => {
  try {
    const posts = await Posts.find();

    res.status(200).json({ posts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve post data", error: error.message });
  }
};

module.exports = { addData, getData };
