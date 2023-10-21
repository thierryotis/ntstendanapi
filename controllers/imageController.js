const express = require('express');
const imageModel = require('../models/imageModel');
const router = express.Router();

// Controller Functions

// Add a new image
const addImage = async (req, res) => {
    try {
        const { url, name, description, title } = req.body;
        
        const newImageId = await imageModel.addImage(url, name, description, title);
        
        res.status(201).json({ message: 'Image added successfully', imageId: newImageId });

    } catch (error) {
        res.status(500).json({ message: 'Error adding image', error: error.message });
    }
};

// Fetch an image by ID
const getImageById = async (req, res) => {
    try {
        const imageId = req.params.id;
        
        const image = await imageModel.getImageById(imageId);
        
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching image', error: error.message });
    }
};

// Define your other controller functions here for updating and deleting images

module.exports = {
    addImage,
    getImageById,
};

// Export the router for use in your main application
module.exports = router;
