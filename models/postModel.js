// postModel.js
const pool = require('../database') 
const imageModel = require('./imageModel')
const table = "posts";
const postImageTable = "posts_images";
const postKeywordTable = "posts_keywords";

// Create a new post
const addPost = async (text, category_id, video, rich_text, title, subtitle, intro, images, keywords) => {
    const query = `
        INSERT INTO ${table} (text, category_id, video, rich_text, title, subtitle, intro)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [text, category_id, video, rich_text, title, subtitle, intro, images, keywords]);
    return result.insertId;
};

// Get all posts
const getPosts = async () => {
    const query = `SELECT * FROM ${table}`;
    const [posts] = await pool.query(query);
    return posts;
};

// Get a post by ID
const getPostById = async (postId) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const [posts] = await pool.query(query, [postId]);
    return posts.length > 0 ? posts[0] : null;
};

// Update a post
const updatePost = async (postId, text, categoryId, video, richText, title, subtitle, intro) => {
    const query = `
        UPDATE ${table} 
        SET text = ?, category_id = ?, video = ?, riche_text = ?, title = ?, subtitle = ?, intro = ? 
        WHERE id = ?
    `;
    const [result] = await pool.query(query, [text, categoryId, video, richText, title, subtitle, intro, postId]);
    return result.affectedRows > 0;
};

// Delete a post
const deletePost = async (postId) => {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await pool.query(query, [postId]);
    return result.affectedRows > 0;
};

// Get posts by category given id
const getPostsByCategory = async (categoryId) => {
    const query = `SELECT * FROM ${table} WHERE category_id = ?`;
    const [posts] = await pool.query(query, [categoryId]);
    return posts;
};
// Get posts by category
const getPostsByCategoryName = async (categoryName) => {
    const query = `
      SELECT posts.*, images.url
      FROM posts
      JOIN categories ON posts.category_id = categories.id
      LEFT JOIN posts_images ON posts.id = posts_images.post_id
      LEFT JOIN images ON posts_images.image_id = images.id
      WHERE categories.name = ?
    `;
    const [posts] = await pool.query(query, [categoryName]);
    console.log(posts, "posts retrieved")
    return posts;

  };
  

// Add images to a post
const addImagesToPost = async (postId, imageIds) => {
    const query = `INSERT INTO ${postImageTable} (post_id, image_id) VALUES (?, ?)`;
    const promises = imageIds.map(imageId => pool.query(query, [postId, imageId]));
    await Promise.all(promises);
    return true; // Returns true on success, can be enhanced to provide more detailed results
};

// Get all images for a post
const getImagesForPost = async (postId) => {
    const query = `
        SELECT i.* FROM images i
        JOIN ${postImageTable} pi ON i.id = pi.image_id
        WHERE pi.post_id = ?
    `;
    const [images] = await pool.query(query, [postId]);
    return images;
};

// Remove an image from a post
const removeImageFromPost = async (postId, imageId) => {
    const query = `DELETE FROM ${postImageTable} WHERE post_id = ? AND image_id = ?`;
    const [result] = await pool.query(query, [postId, imageId]);
    return result.affectedRows > 0;
};

// Remove all images from a post (e.g., if a post is deleted or needs all images cleared)
const removeAllImagesFromPost = async (postId) => {
    const query = `DELETE FROM ${postImageTable} WHERE post_id = ?`;
    const [result] = await pool.query(query, [postId]);
    return result.affectedRows > 0;
    
};

// Associate keywords with a post
const addKeywordsToPost = async (postId, keywordIds) => {
    const query = `INSERT INTO ${postKeywordTable} (post_id, keyword_id) VALUES (?, ?)`;
    const promises = keywordIds.map(keywordId => pool.query(query, [postId, keywordId]));
    await Promise.all(promises);
    return true; // Returns true on success
};

// Retrieve all keywords associated with a specific post
const getKeywordsForPost = async (postId) => {
    const query = `
        SELECT k.* FROM keywords k
        JOIN ${postKeywordTable} pk ON k.id = pk.keyword_id
        WHERE pk.post_id = ?
    `;
    const [keywords] = await pool.query(query, [postId]);
    return keywords;
};

// Disassociate a specific keyword from a post
const removeKeywordFromPost = async (postId, keywordId) => {
    const query = `DELETE FROM ${postKeywordTable} WHERE post_id = ? AND keyword_id = ?`;
    const [result] = await pool.query(query, [postId, keywordId]);
    return result.affectedRows > 0;
};

// Disassociate all keywords from a post (for instance, when a post is deleted or if you want to reset its keywords)
const removeAllKeywordsFromPost = async (postId) => {
    const query = `DELETE FROM ${postKeywordTable} WHERE post_id = ?`;
    const [result] = await pool.query(query, [postId]);
    return result.affectedRows > 0;
};



module.exports = {
    addPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostsByCategory,
    addImagesToPost,
    getImagesForPost,
    removeImageFromPost,
    removeAllImagesFromPost,
    addKeywordsToPost,
    getKeywordsForPost,
    removeKeywordFromPost,
    removeAllKeywordsFromPost,
    getPostsByCategoryName
};
