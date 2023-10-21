const express = require("express");
const postModel = require("../models/postModel");
const imageModel = require("../models/imageModel")
const router = express.Router();

// Controller Functions
// Add a new post
const addPost = async (req, res) => {
  try {
    const {
      text,
      category_id,
      video,
      rich_text,
      title,
      subtitle,
      intro,
      keywords,
    } = req.body;
    // Check if there are image files in the request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }
    const images = [];

    for (const key in req.files) {
      const imageFile = req.files[key];
      const imagePath = await handleImageUpload(imageFile);
      images.push(imageFile);
    }

    // Add a new post with the image paths
    const newPostId = await postModel.addPost(
      text,
      category_id,
      video,
      rich_text,
      title,
      subtitle,
      intro,
      images
    );

    // If keywords are provided, add them to the post
    if (keywords && keywords.length > 0) {
      await postModel.addKeywordsToPost(newPostId, keywords);
    }
    //inserting images
    try {
      const imgIds = [];
      console.log(images, "while inserting images")
      for (let i in images) {
        console.log(i)
        let id = await imageModel.addImage(images[i].name,images[i].name, images[i].name,images[i].name,);
        imgIds.push(id);
      }
      await postModel.addImagesToPost(newPostId, imgIds);
    } catch (e) {
      return res
        .status(500)
        .json({
          message: "Error while inserting images to post",
          error: e.message,
        });
    }

    res.status(201).json({ message: "Post added", postId: newPostId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding post", error: error.message });
  }
};

// Function to handle image upload and return the image path (you may need to implement this)
const handleImageUpload = async (image) => {
  
  // For demonstration purposes, we'll assume you're storing images locally
  const imagePath = `/uploads/${image.name}`;

  // Save the image to the local file system (adjust this based on your storage mechanism)
  await image.mv(`./public${imagePath}`);

  return imagePath;
};

// Other controllers remain similar. But let's add a controller to fetch all details of a post:

const getDetailedPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await postModel.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const images = await postModel.getImagesForPost(postId);
    const keywords = await postModel.getKeywordsForPost(postId);
    const category = await postModel.getCategoryForPost(postId); // Assuming this method exists in the model
    const video = await postModel.getVideoForPost(postId); // Assuming this method exists in the model

    res.status(200).json({
      post,
      images,
      keywords,
      category,
      video,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching post details", error: error.message });
  }
};

// Get all posts
const listPosts = async (req, res) => {
  try {
    const posts = await postModel.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};

// Delete post by ID
const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const success = await postModel.deletePost(postId);
    if (success) {
      res.status(200).json({ message: "Post deleted" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

// Update post by ID
const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const {
      text,
      category_id,
      video,
      riche_text,
      title,
      subtitle,
      intro,
      images,
      keywords,
    } = req.body;

    // Update the post's primary attributes
    const success = await postModel.updatePost(postId, {
      text,
      category_id,
      video,
      riche_text,
      title,
      subtitle,
      intro,
    });
    if (!success) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update associated images
    if (images && images.length > 0) {
      await postModel.clearImagesForPost(postId); // Assuming this method deletes all associated images
      await postModel.addImagesToPost(postId, images);
    }

    // Update associated keywords
    if (keywords && keywords.length > 0) {
      await postModel.removeKeywordFromPost(postId); // Assuming this method deletes all associated keywords
      await postModel.addKeywordsToPost(postId, keywords);
    }

    // Note: For category and video, if they can be updated directly in the post's attributes, then the above updatePost model call handles it.
    // But if they have separate methods in the model for updates, you'd call those here.

    res.status(200).json({ message: "Post updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

// Get posts by category given name
const getPostsByCategoryName = async (req, res) => {
  try {
    const categoryName = req.params.categoryName; // Get the category name from the request parameters

    // Call the corresponding model method to get posts by category
    const posts = await postModel.getPostsByCategoryName(categoryName);

    res.status(200).json(posts);
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Error fetching posts by category", error: error.message });
  }
};

// Routes

router.post("/add", addPost);
router.get("/list", listPosts);
router.get("/getpost/:postId", getDetailedPostById);
router.delete("/delete/:postId", deletePost);
router.put("/update/:postId", updatePost);
router.get("/getbycategory/:categoryName", getPostsByCategoryName);

// Export the router
module.exports = router;
