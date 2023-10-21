const pool = require("../database");
const table = "messages";

const addMessage = async (sender_name, sender_email, subject, content) => {
    const query = `INSERT INTO ${table} (sender_name, sender_email, subject, content) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(query, [sender_name, sender_email, subject, content]);
    return result.insertId;
  };
  
// Get all messages
const getMessages = async () => {
  const query = `SELECT * FROM ${table}`;
  const [messages] = await pool.query(query);
  return messages;
};

// Get a message by ID
const getMessageById = async (messageId) => {
  const query = `SELECT * FROM ${table} WHERE id = ?`;
  const [messages] = await pool.query(query, [messageId]);
  return messages.length > 0 ? messages[0] : null;
};

// Update a message
const updateMessage = async (messageId, sender_name, sender_email, content) => {
  const query = `UPDATE ${table} SET sender_name = ?, sender_email = ?, content = ? WHERE id = ?`;
  const [result] = await pool.query(query, [
    sender_name,
    sender_email,
    content,
    messageId,
  ]);
  return result.affectedRows > 0;
};

// Delete a message
const deleteMessage = async (messageId) => {
  const query = `DELETE FROM ${table} WHERE id = ?`;
  const [result] = await pool.query(query, [messageId]);
  return result.affectedRows > 0;
};

module.exports = {
  addMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};
