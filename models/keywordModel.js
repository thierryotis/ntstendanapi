// keywordModel.js
const pool = require('../database');
const table = "keywords";

// Add a new keyword
const addKeyword = async (name) => {
    const query = `INSERT INTO ${table} (name) VALUES (?)`;
    const [result] = await pool.query(query, [name]);
    return result.insertId;
};

// Get all keywords
const getKeywords = async () => {
    const query = `SELECT * FROM ${table}`;
    const [keywords] = await pool.query(query);
    return keywords;
};

// Get a keyword by ID
const getKeywordById = async (keywordId) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const [keywords] = await pool.query(query, [keywordId]);
    return keywords.length > 0 ? keywords[0] : null;
};

// Update a keyword
const updateKeyword = async (keywordId, name) => {
    const query = `UPDATE ${table} SET name = ? WHERE id = ?`;
    const [result] = await pool.query(query, [name, keywordId]);
    return result.affectedRows > 0;
};

// Delete a keyword
const deleteKeyword = async (keywordId) => {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await pool.query(query, [keywordId]);
    return result.affectedRows > 0;
};

// Search keywords by name (useful for auto-suggest or autocomplete features)
const searchKeywordsByName = async (name) => {
    const query = `SELECT * FROM ${table} WHERE name LIKE ?`;
    const [keywords] = await pool.query(query, [`%${name}%`]);
    return keywords;
};

module.exports = {
    addKeyword,
    getKeywords,
    getKeywordById,
    updateKeyword,
    deleteKeyword,
    searchKeywordsByName
};
