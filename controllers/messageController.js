const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel'); // Assuming you have a Message model defined

// Create a new message
router.post('/sendmessage', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const savedMessage = await Message.addMessage(
      name,
      email,
      subject,
      message,
    );
    res.status(201).json({ message: "Message send successfully", savedMessage: savedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

// Get all messages
router.get('/list', async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not retrieve messages' });
  }
});

// Get a specific message by ID
router.get('/single/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve the message' });
  }
});

// Update a message by ID
router.put('/:id', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { name, email, subject, message },
      { new: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: 'Could not update the message' });
  }
});

// Delete a message by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndRemove(req.params.id);
    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    res.status(500).json({ error: 'Could not delete the message' });
  }
});

module.exports = router;
