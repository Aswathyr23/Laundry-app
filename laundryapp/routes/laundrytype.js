const express = require('express');
const Laundrytypemodel = require('../Model/Laundrytypemodel');

const router = express.Router();

router.post('/addlaundrytype', async (req, res) => {
  const {  Laundrytype_name, Laundrytype_image } = req.body;

  if ( !Laundrytype_name || !Laundrytype_image) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  try {
    const newlaundrytype= new Laundrytypemodel({ Laundrytype_name, Laundrytype_image });
    await newlaundrytype.save();
    res.status(201).json({ message: 'Laundry type added successfully',
      _id: newlaundrytype._id,
      Laundrytype_name: newlaundrytype.Laundrytype_name,
      Laundrytype_image: newlaundrytype.Laundrytype_image
     });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding Laundry type', error });
  }
});


// Update laundry type
router.put('/updatelaundrytype', async (req, res) => {
  const { _id, newLaundrytype_name, newLaundrytype_image } = req.body;

  // Check if _id is provided for update
  if (!_id) {
    return res.status(400).json({ message: 'Please provide Laundrytype ID' });
  }

  try {
    // Construct the update object based on provided fields
    const updateFields = {};
    if (newLaundrytype_name) updateFields.Laundrytype_name = newLaundrytype_name;
    if (newLaundrytype_image) updateFields.Laundrytype_image = newLaundrytype_image;

    // Find and update the document by _id
    const updatedLaundryType = await Laundrytypemodel.findByIdAndUpdate(
      _id,
      updateFields,
      { new: true } // Return updated document
    );

    if (!updatedLaundryType) {
      return res.status(404).json({ message: 'Laundry type not found' });
    }

    // Return success message and updated document
    res.status(200).json({ message: 'Laundry type updated successfully', laundrytype: updatedLaundryType });
  } catch (error) {
    console.error('Error updating laundry type:', error);
    res.status(500).json({ message: 'Error updating laundry type', error });
  }
});


router.get('/viewlaundrytype', async (req, res) => {
  const { _id } = req.body; // Using req.body to get _id

  try {
    if (_id) {
      // If _id is provided, find the specific laundry type by _id
      const laundrytype = await Laundrytypemodel.findById(_id);

      if (laundrytype) {
        return res.status(200).json({ message: 'Laundry type found', laundrytype });
      } else {
        return res.status(404).json({ message: 'Laundry type not found' });
      }
    } else {
      // If _id is not provided, return all laundry types
      const laundrytypes = await Laundrytypemodel.find();
      return res.status(200).json({ message: 'All laundry types', laundrytypes });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error', error });
  }
});


// // DLT
router.delete('/deletelaundrytype', async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ message: 'Please provide Laundrytyp ID ' });
  }
  try {
    const deletedlaundrytype = await Laundrytypemodel.findOneAndDelete({ _id}); 
    if (!deletedlaundrytype) {
      return res.status(404).json({ message: 'laundry type not found or already deleted' });
    }

    res.status(200).json({ message: 'laundry type deleted successfully', category: deletedlaundrytype });
  } catch (error) {
    console.error('Error deleting laundry type:', error);
    res.status(500).json({ message: 'Error deleting laundry type', error });
  }
});



module.exports = router;
