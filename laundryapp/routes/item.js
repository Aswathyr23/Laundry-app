const express = require('express');
const ItemModel = require('../Model/Itemmodel')

const router = express.Router();

// POST /additem - Add a new item
router.post('/additem', async (req, res) => {
    const { item_name, item_image, id_laundrytype, category_id,item_weight } = req.body;
  
    // Check if required fields are missing or invalid
    if (!item_name || !item_image || !Array.isArray(id_laundrytype) || id_laundrytype.length < 1 || !category_id) {
      return res.status(400).json({ message: 'Please provide all required fields correctly' });
    }
    try {
      // Create an array to hold laundry types with prices
      const laundryTypes = [];
  
      // Loop through each id_laundrytype from request body
      for (const laundry of id_laundrytype) {
        // Validate each laundry type object
        if (!laundry.id || !laundry.price) {
          return res.status(400).json({ message: 'Please provide id and price for each laundry type' });
        }
  
        // Push validated laundry type object to laundryTypes array
        laundryTypes.push({
          id: laundry.id,
          price: laundry.price
        });
      }
      // Create a new item instance
      const newItem = new ItemModel({
        item_name,
        item_image,
        category_id,
        item_weight,
        id_laundrytype: laundryTypes // Assign array of laundry types with prices
      });
      // Save the new item to the database
      await newItem.save();
  
      // Return success response with details of the added item
      res.status(201).json({
        message: 'Item added successfully',
        _id: newItem._id,
        item_name: newItem.item_name,
        item_image: newItem.item_image,
        category_id: newItem.category_id,
        item_weight:newItem.item_weight,
        id_laundrytype: newItem.id_laundrytype // Return the updated array with prices
      });
    } catch (error) {
      console.error('Error adding item:', error);
      res.status(500).json({ message: 'Error adding item', error: error.message });
    }
  });

// update
router.put('/updateitem', async (req, res) => {
    const { _id, id_laundrytype, item_name, item_image, category_id, item_weight } = req.body;
  
    // Check if required fields are missing or invalid
    if (!_id || !id_laundrytype || !Array.isArray(id_laundrytype) || id_laundrytype.length < 1) {
      return res.status(400).json({ message: 'Please provide _id and id_laundrytype with prices to update' });
    }
  
    try {
      // Prepare updated laundry types array
      const updatedLaundryTypes = [];
  
      // Loop through each id_laundrytype from request body
      for (const laundry of id_laundrytype) {
        // Validate each laundry type object
        if (!laundry.id || !laundry.price) {
          return res.status(400).json({ message: 'Please provide id and price for each laundry type' });
        }
  
        // Push validated laundry type object to updatedLaundryTypes array
        updatedLaundryTypes.push({
          id: laundry.id,
          price: laundry.price
        });
      }
  
      // Update the item in the database
      const updatedItem = await ItemModel.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            id_laundrytype: updatedLaundryTypes,
            item_name: item_name,
            item_image: item_image,
            category_id: category_id,
            item_weight: item_weight
          }
        },
        { new: true } // To return the updated item rather than the original item
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      // Return success response with updated item details
      res.json({
        message: 'Item updated successfully',
        _id: updatedItem._id,
        item_name: updatedItem.item_name,
        item_image: updatedItem.item_image,
        category_id: updatedItem.category_id,
        id_laundrytype: updatedItem.id_laundrytype,
        item_weight: updatedItem.item_weight
      });
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Error updating item', error: error.message });
    }
  });
  
  
//view 
router.get('/viewitem', async (req, res) => {
    try {
      const {_id } = req.body; // Get _id from request body
  
      if (_id) {
        // If _id is provided, find a specific category
        const item = await ItemModel.findById(_id);
  
        if (item) {
          return res.status(200).json({ message: 'item found', item });
        } else {
          return res.status(404).json({ message: 'item not found' });
        }
      } else {
        // If no _id is provided, return all item
        const item = await ItemModel.find();
        return res.status(200).json({ message: 'All item', item });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error', error });
    }
  });


// // delete  

router.delete('/deleteitem', async (req, res) => {
    const {_id} = req.body;

    if (!_id) {
      return res.status(400).json({ message: 'Please provide item name in the request body' });
    }
    try {
      const deleteitem = await ItemModel.findOneAndDelete({_id}); 
      if (!deleteitem) {
        return res.status(404).json({ message: 'item not found or already deleted' });
      }

      res.status(200).json({ message: 'item  deleted successfully', item: deleteitem });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ message: 'Error deleting item', error });
    }
  });

module.exports = router;