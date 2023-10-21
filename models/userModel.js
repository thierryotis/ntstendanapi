const { createPool } = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const roleModel = require("../models/roleModel");

const pool = require('../database')
const table = "users"
const table_users_roles = "users_roles"
// Add user
const addUser = async (nom, telephone, email, password, role) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO ${table} (nom, telephone, email, password, role) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.query(query, [nom, telephone, email, hashedPassword, role]);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

// Get users
const getUsers = async () => {
  try {
    const query = `SELECT * FROM ${table}`;
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    throw error;
  }
};

// User login
const login = async (email, password) => {
  try {
    const query = `SELECT * FROM ${table} WHERE email = ? OR telephone = ?`;
    const [rows] = await pool.query(query, [email, email]);

    if (rows.length === 0) {
      console.log('user not found');
      return null;
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('incorrect password');
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const query = "DELETE FROM users WHERE id = ?";
    const [result] = await pool.query(query, [userId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

// User logout
const logout = () => {
  // Perform any logout-related operations
};

// Update user password
const updatePassword = async (id, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = "UPDATE users SET password = ? WHERE id = ?";
    const [result] = await pool.query(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

//add subscriber
const addSubscriber = async (email) => {
  try {
    const roleName = "subscriber"
    const query = `INSERT INTO ${table} (name, email, login) VALUES (?, ?, ?)`;
    const [result] = await pool.query(query, [email, email, email]);
    const userId = result.insertId;
    //Now get the id of "subscriber" role, then insert it in users_roles table
    const role = await roleModel.getRoleByName(roleName)
    console.log(role, "role")
    const query2 = `INSERT INTO ${table_users_roles} VALUES (?, ?)`
    const [result2] = await pool.query(query2, [userId, role.id])
    return userId
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addUser,
  getUsers,
  login,
  deleteUser,
  logout,
  updatePassword,
  addSubscriber
};
