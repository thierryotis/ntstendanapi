// roleModel.js
const pool = require('../database') 
const table = "roles";

// Add a role
const addRole = async (name, description) => {
    try {
        const query = `INSERT INTO ${table} (name, description) VALUES (?, ?)`;
        const [result] = await pool.query(query, [name, description]);
        return result.insertId;
    } catch (error) {
        throw error;
    }
};

// Get roles
const getRoles = async () => {
    try {
        const query = `SELECT * FROM ${table}`;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        throw error;
    }
};

// Get role by ID
const getRoleById = async (roleId) => {
    try {
        const query = `SELECT * FROM ${table} WHERE id = ?`;
        const [rows] = await pool.query(query, [roleId]);
        if (rows.length === 0) return null;
        return rows[0];
    } catch (error) {
        throw error;
    }
};



// Update a role
const updateRole = async (roleId, name, description) => {
    try {
        const query = `UPDATE ${table} SET name = ?, description = ? WHERE id = ?`;
        const [result] = await pool.query(query, [name, description, roleId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};

// Delete a role
const deleteRole = async (roleId) => {
    try {
        const query = `DELETE FROM ${table} WHERE id = ?`;
        const [result] = await pool.query(query, [roleId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw error;
    }
};


const getPermissionsByRoleId = async (roleId) => {
    try {
        const query = `
            SELECT p.id, p.name, p.description
            FROM permissions p
            INNER JOIN roles-permissions rp ON p.id = rp.permission_id
            WHERE rp.role_id = ?`;
        const [permissions] = await pool.query(query, [roleId]);
        return permissions;
    } catch (error) {
        throw error;
    }
};
// Assign Permission to a Role
const assignPermissionToRole = async (roleId, permissionId) => {
    const query = "INSERT INTO roles-permissions (role_id, permission_id) VALUES (?, ?)";
    const [result] = await pool.query(query, [roleId, permissionId]);
    return result.affectedRows > 0;
};

// Remove Permission from a Role
const removePermissionFromRole = async (roleId, permissionId) => {
    const query = "DELETE FROM roles-permissions WHERE role_id = ? AND permission_id = ?";
    const [result] = await pool.query(query, [roleId, permissionId]);
    return result.affectedRows > 0;
};

// Check if Role has a Specific Permission
const roleHasPermission = async (roleId, permissionId) => {
    const query = "SELECT 1 FROM roles-permissions WHERE role_id = ? AND permission_id = ?";
    const [result] = await pool.query(query, [roleId, permissionId]);
    return result.length > 0;
};

// List Roles for a Specific Permission
const getRolesForPermission = async (permissionId) => {
    const query = `
        SELECT r.id, r.name, r.description
        FROM ${table} r
        INNER JOIN roles-permissions rp ON r.id = rp.role_id
        WHERE rp.permission_id = ?`;
    const [roles] = await pool.query(query, [permissionId]);
    return roles;
};

// Bulk Assign Permissions
const bulkAssignPermissions = async (roleId, permissionIds) => {
    const query = "INSERT INTO roles-permissions (role_id, permission_id) VALUES ?";
    const values = permissionIds.map(permissionId => [roleId, permissionId]);
    const [result] = await pool.query(query, [values]);
    return result.affectedRows;
};

// Bulk Remove Permissions
const bulkRemovePermissions = async (roleId, permissionIds) => {
    const query = "DELETE FROM roles-permissions WHERE role_id = ? AND permission_id IN (?)";
    const [result] = await pool.query(query, [roleId, permissionIds]);
    return result.affectedRows;
};

// Search Roles
const searchRoles = async (searchTerm) => {
    const query = `SELECT * FROM ${table} WHERE name LIKE ? OR description LIKE ?`;
    const [roles] = await pool.query(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
    return roles;
};

// Get Role by Name
const getRoleByName = async (roleName) => {
    const query = `SELECT * FROM ${table} WHERE name = ?`;
    const [roles] = await pool.query(query, [roleName]);
    return roles.length > 0 ? roles[0] : null;
};

// Get Role Count
const getRoleCount = async () => {
    const query = `SELECT COUNT(*) AS count FROM ${table}`;
    const [result] = await pool.query(query);
    return result[0].count;
};

// Get Role and its Permissions
const getRoleWithPermissions = async (roleId) => {
    const roleQuery = `SELECT * FROM ${table} WHERE id = ?`;
    const permissionQuery = `
        SELECT p.id, p.name, p.description
        FROM permissions p
        INNER JOIN roles-permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = ?`;
    const [roleResult] = await pool.query(roleQuery, [roleId]);
    const [permissions] = await pool.query(permissionQuery, [roleId]);

    if (roleResult.length === 0) return null;

    const role = roleResult[0];
    role.permissions = permissions;

    return role;
};

module.exports = {
    addRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    getPermissionsByRoleId,
    assignPermissionToRole,
    removePermissionFromRole,
    roleHasPermission,
    getRolesForPermission,
    bulkAssignPermissions,
    bulkRemovePermissions,
    searchRoles,
    getRoleByName,
    getRoleCount,
    getRoleWithPermissions,

};
