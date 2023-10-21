// permissionModel.js
const pool = require('./../database');
const table = "permissions";

// Add a new permission
const addPermission = async (name, description) => {
    const query = `INSERT INTO ${table} (name, description) VALUES (?, ?)`;
    const [result] = await pool.query(query, [name, description]);
    return result.insertId;
};

// Get all permissions
const getPermissions = async () => {
    const query = `SELECT * FROM ${table}`;
    const [permissions] = await pool.query(query);
    return permissions;
};

// Get a permission by ID
const getPermissionById = async (permissionId) => {
    const query = `SELECT * FROM ${table} WHERE id = ?`;
    const [permissions] = await pool.query(query, [permissionId]);
    return permissions.length > 0 ? permissions[0] : null;
};

// Update a permission
const updatePermission = async (permissionId, name, description) => {
    const query = `UPDATE ${table} SET name = ?, description = ? WHERE id = ?`;
    const [result] = await pool.query(query, [name, description, permissionId]);
    return result.affectedRows > 0;
};

// Delete a permission
const deletePermission = async (permissionId) => {
    const query = `DELETE FROM ${table} WHERE id = ?`;
    const [result] = await pool.query(query, [permissionId]);
    return result.affectedRows > 0;
};

// Search permissions by name
const searchPermissionsByName = async (name) => {
    const query = `SELECT * FROM ${table} WHERE name LIKE ?`;
    const [permissions] = await pool.query(query, [`%${name}%`]);
    return permissions;
};

module.exports = {
    addPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
    searchPermissionsByName
};
