const express = require('express');
const router = express.Router();

const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const userController = {

  // Add a user
  addUser: async (req, res) => {
    try {
      const { nom, telephone, email, password, role } = req.body;
      const userId = await userModel.addUser(nom, telephone, email, password, role);
      res.status(201).json({ message: 'User added successfully', userId });
    } catch (error) {
      res.status(500).json({ message: 'Error adding user', error });
    }
  },
  // Add a subscriber
  addSubscriber: async (req, res) => {
    try {
      const { email } = req.body;
      const userId = await userModel.addSubscriber(email);
      res.status(201).json({ message: 'Subscriber added successfully', userId });
    } catch (error) {
      res.status(500).json({ message: 'Error adding user', error });
    }
  },

  // List all users
  listUsers: async (req, res) => {
    try {
      const users = await userModel.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving users', error });
    }
  },

  // User login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userModel.login(email, password);

      if (!user) {
        return res.status(401).json({ message: 'Email or password incorrect' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.id, email: user.email }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: 'Error during login', error });
    }
  },

  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await userModel.deleteUser(userId);
      
      if (result) {
        res.status(200).json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  },

  // Update user's password
  updatePassword: async (req, res) => {
    try {
      const { userId } = req.params;
      const { newPassword } = req.body;

      const result = await userModel.updatePassword(userId, newPassword);

      if (result) {
        res.status(200).json({ message: 'Password updated successfully' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating password', error });
    }
  }

  // You can add more methods (endpoints) as needed.

};

// Route to add a user
router.post('/add', userController.addUser);
router.post('/addsubscriber', userController.addSubscriber);
// Route to list all users
router.get('/list', userController.listUsers);

// Route to login a user
router.post('/login', userController.login);

// Route to delete a user by ID
router.delete('/:userId', userController.deleteUser);

// Route to update user's password by ID
router.put('/update-password/:userId', userController.updatePassword);



// Export the router
module.exports = router;

