const pool = require("../database");
const table = "staff";

// Add a new staff member
const addStaffMember = async (
  name,
  email,
  phone,
  photopath,
  position,
  linkedin,
  facebook,
  twitter,
  instagram,
  youtube,
  bio
) => {
  const query = `INSERT INTO staff (name, email, phone, photo, position, linkedin, facebook, twitter, instagram, youtube, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [name,email,phone,photopath,position,linkedin, facebook,twitter, instagram,youtube, bio];

  const [result] = await pool.query(query, values);
  return result.insertId;
};

// Get all staff members
const getStaffMembers = async () => {
  const query = `SELECT * FROM ${table}`;
  const [staff] = await pool.query(query);
  console.log(staff, "staff retrieved")
  return staff;
};

// Get a staff member by ID
const getStaffMemberById = async (staffId) => {
  const query = `SELECT * FROM ${table} WHERE id = ?`;
  const [staff] = await pool.query(query, [staffId]);
  return staff.length > 0 ? staff[0] : null;
};

// Update a staff member
const updateStaffMember = async (
  staffId,
  name,
  email,
  phone,
  position,
  linkedin,
  facebook,
  twitter,
  instagram,
  youtube,
  bio
) => {
  const query = `UPDATE ${table} SET name = ?, email = ?, phone = ?, position = ?, linkedin = ?, facebook = ?, twitter = ?, instagram = ?, youtube = ?, bio = ? WHERE id = ?`;
  const [result] = await pool.query(query, [
    name,
    email,
    phone,
    position,
    linkedin,
    facebook,
    twitter,
    instagram,
    youtube,
    bio,
    staffId,
  ]);
  return result.affectedRows > 0;
};

// Delete a staff member by ID
const deleteStaffMember = async (staffId) => {
  const query = `DELETE FROM ${table} WHERE id = ?`;
  const [result] = await pool.query(query, [staffId]);
  return result.affectedRows > 0;
};

module.exports = {
  addStaffMember,
  getStaffMembers,
  getStaffMemberById,
  updateStaffMember,
  deleteStaffMember,
};
