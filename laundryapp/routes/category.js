const express = require('express');
const categoryModel = require('../Model/Categorymodel');

const router = express.Router(); 

// add dress category
router.post('/addcategory', async (req, res) => {
  const { category_name, category_image, id_laundrytype } = req.body;

  // Check if required fields are missing or invalid
  if (!category_name || !category_image || !Array.isArray(id_laundrytype) || id_laundrytype.length < 1) {
    return res.status(400).json({ message: 'Please provide all required fields correctly' });
  }

  try {
    // Create a new category instance
    const newcategory = new categoryModel({ category_name, category_image, id_laundrytype });

    // Save the new category to the database
    await newcategory.save();

    // Return success response with details of the added category
    res.status(201).json({
      message: 'Category added successfully',
      _id: newcategory._id,
      category_name: newcategory.category_name,
      category_image: newcategory.category_image,
      id_laundrytype:newcategory.id_laundrytype
    });
  } catch (error) {
    console.error('Error adding new category:', error);
    res.status(500).json({ message: 'Error adding new category', error: error.message });
  }
});


//  // update
router.put('/updatecategory', async (req, res) => {
  const { _id, category_name, category_image, id_laundrytype } = req.body;

  // Check if required fields are missing or invalid
  if (!_id || !category_name || !category_image || !Array.isArray(id_laundrytype) || id_laundrytype.length < 1) {
    return res.status(400).json({ message: 'Please provide all required fields correctly' });
  }

  try {
    // Find the category by ID and update its fields
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      _id,
      { category_name, category_image, id_laundrytype },
      { new: true } // Return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Return success response with updated category details
    res.status(200).json({
      message: 'Category updated successfully',
      _id: updatedCategory._id,
      category_name: updatedCategory.category_name,
      category_image: updatedCategory.category_image,
      id_laundrytype: updatedCategory.id_laundrytype
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
});

  
 

// //view
router.get('/viewcategory', async (req, res) => {
  try {
    const {_id } = req.body; // Get _id from request body

    if (_id) {
      // If _id is provided, find a specific category
      const category = await categoryModel.findById(_id);
      if (category) {
        return res.status(200).json({ message: 'Category found', category });
      } else {
        return res.status(404).json({ message: 'Category not found' });
      }
    } else {
      // If no _id is provided, return all categories
      const categories = await categoryModel.find();
      return res.status(200).json({ message: 'All categories', categories });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error', error });
  }
});

// //delete dress category


router.delete('/deletecategory', async (req, res) => {
  const {_id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: 'Please provide dress category name in the request body' });
  }

  try {
    const deletedcategory = await categoryModel.findOneAndDelete({_id});

    if (!deletedcategory) {
      return res.status(404).json({ message: 'Dress category not found or already deleted' });
    }

    res.status(200).json({ message: 'Dresscategory deleted successfully', category: deletedcategory });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category', error });
  }
});

module.exports = router;