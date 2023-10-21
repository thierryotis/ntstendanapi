// categoryModel.js
const pool = require('../database') 
const table = "categories";

// Add a new category
const addCategory = async (name, description) => {
    const query = `INSERT INTO ${table} (name, description) VALUES (?, ?)`;
    const [result] = await pool.query(query, [name, description]);
    return result.insertId;
};

// Get all categories
const getCategories = async () => {
    const query = `SELECT * FROM ${table}`;
    const [categories] = await pool.query(query);
    return categories;
};

// Get a category by ID
const getCategoryById = async (categoryId) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const [categories] = await pool.query(query, [categoryId]);
    return categories.length > 0 ? categories[0] : null;
};

// Update a category
const updateCategory = async (categoryId, name, description) => {
    const query = `UPDATE ${table} SET name = ?, description = ? WHERE id = ?`;
    const [result] = await pool.query(query, [name, description, categoryId]);
    return result.affectedRows > 0;
};

// Delete a category
const deleteCategory = async (categoryId) => {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await pool.query(query, [categoryId]);
    return result.affectedRows > 0;
};

// Get categories by name (useful for searching)
const getCategoriesByName = async (name) => {
    const query = `SELECT * FROM ${table} WHERE name LIKE ?`;
    const [categories] = await pool.query(query, [`%${name}%`]);
    return categories;
};

module.exports = {
    addCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoriesByName
};
