const express = require('express');
const router = express.Router();
const Staff = require('../models/staffModel');

// Function to handle image upload and return the image path
const handleImageUpload = async (image) => {
  // For demonstration purposes, we'll assume you're storing images locally
  const imagePath = `/uploads/${image.name}`;

  // Save the image to the local file system (adjust this based on your storage mechanism)
  await image.mv(`./public${imagePath}`);

  return imagePath;
};

// Create a new staff member
router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, position, linkedin, facebook, twitter, instagram, youtube, bio } = req.body;

    if (!req.files || !req.files.photo) {
      return res.status(400).json({ error: 'No photo uploaded' });
    }

    const photoPath = await handleImageUpload(req.files.photo);

    const savedStaffMemberId = await Staff.addStaffMember(
      name,
      email,
      phone,
      photoPath,
      position,
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube,
      bio
    );

    res.status(201).json(savedStaffMemberId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not create the staff member' });
  }
});

// Get all staff members
router.get('/list', async (req, res) => {
  try {
    const staffMembers = await Staff.getStaffMembers();
    res.status(200).json(staffMembers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Could not retrieve staff members' });
  }
});

// Get a specific staff member by ID
router.get('/single/:id', async (req, res) => {
  try {
    const staffMember = await Staff.getStaffMemberById(req.params.id);
    if (!staffMember) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.status(200).json(staffMember);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve the staff member' });
  }
});

// Update a staff member by ID
router.put('/update/:id', async (req, res) => {
  try {
    const { name, email, phone, position, linkedin, facebook, twitter, instagram, youtube, bio } = req.body;
    const updated = await Staff.updateStaffMember(req.params.id, name, email, phone, position, linkedin, facebook, twitter, instagram, youtube, bio);
    if (!updated) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.status(200).json({ message: 'Staff member updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not update the staff member' });
  }
});

// Delete a staff member by ID
router.delete('/delete/:id', async (req, res) => {
  try {
    const deleted = await Staff.deleteStaffMember(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Staff member not found' });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    res.status(500).json({ error: 'Could not delete the staff member' });
  }
});

module.exports = router;
