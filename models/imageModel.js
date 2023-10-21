// imageModel.js
const pool = require('../database') 
const table = "images";

// Add a new image
const addImage = async (url, name, description, title) => {
    const query = `INSERT INTO ${table} (url, name, description, title) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(query, [url, name, description, title]);
    return result.insertId;
};

// Get all images
const getImages = async () => {
    const query = `SELECT * FROM ${table}`;
    const [images] = await pool.query(query);
    return images;
};

// Get an image by ID
const getImageById = async (imageId) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const [images] = await pool.query(query, [imageId]);
    return images.length > 0 ? images[0] : null;
};

// Update an image
const updateImage = async (imageId, url, name, description, title) => {
    const query = `UPDATE ${table} SET url = ?, name = ?, description = ?, title = ? WHERE id = ?`;
    const [result] = await pool.query(query, [url, name, description, title, imageId]);
    return result.affectedRows > 0;
};

// Delete an image
const deleteImage = async (imageId) => {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await pool.query(query, [imageId]);
    return result.affectedRows > 0;
};

// Search images by name (can be expanded to search by other attributes as well)
const searchImagesByName = async (name) => {
    const query = `SELECT * FROM ${table} WHERE name LIKE ?`;
    const [images] = await pool.query(query, [`%${name}%`]);
    return images;
};

module.exports = {
    addImage,
    getImages,
    getImageById,
    updateImage,
    deleteImage,
    searchImagesByName
};
