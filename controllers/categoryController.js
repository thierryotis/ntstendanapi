const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel'); // Assuming you have a Category model defined

// Create a new category
router.post('/add', async (req, res) => {
  try {
    const { name, description } = req.body;
    const savedCategory = await Category.addCategory( name, description );
    res.status(201).json(savedCategory);
  } catch (error) {
	  console.log(error)
    res.status(500).json({ error: 'Could not create the category' });
  }
});

// Get all categories
router.get('/list', async (req, res) => {
  try {
    const categories = await Category.getCategories();
    res.status(200).json(categories);
  } catch (error) {
	   console.log(error);
    res.status(500).json({ error: 'Could not retrieve categories' });
  }
});

// Get a specific category by ID
router.get('/single/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve the category' });
  }
});

// Update a category by ID
router.put('/categories/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Could not update the category' });
  }
});

// Delete a category by ID
router.delete('/categories/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndRemove(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(204).end(); // No content (successful deletion)
  } catch (error) {
    res.status(500).json({ error: 'Could not delete the category' });
  }
});

module.exports = router;
