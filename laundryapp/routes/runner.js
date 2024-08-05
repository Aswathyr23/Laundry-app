const express = require('express');
const Runnermodel = require('../Model/Runner'); 
const OrderModel=require('../Model/Ordermodel');
const TimeslotModel=require('../Model/Timeslotmodel')
const mongoose=require('mongoose')

const router = express.Router();
// Registration route
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };  
  router.post('/runner-registration', async (req, res) => {
    const { runner_mobile_no } = req.body;
    if (!runner_mobile_no) {
      return res.status(400).json({ message: 'Please provide Mobile number' });
    }
    try {
      const otp = generateOtp();
      let runner = await Runnermodel.findOne({ runner_mobile_no });
      if (runner) {
        runner.otp = otp;
        await runner.save();
      } else {
        // Create a new user with the generated OTP
        runner = new Runnermodel({ runner_mobile_no, otp });
        await runner.save();
      }
      // Send OTP to user's mobile number
      // await sendOtp(runner_mobile_no, otp);
  
      res.status(201).json({
        message: 'Runner registered successfully, OTP sent',
        otp,
        runner_id: runner._id 
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error', error });
    }
  });
// loginn    
router.post('/runner-login', async (req, res) => {
    const { runner_mobile_no, otp } = req.body;
  
    if (!runner_mobile_no || !otp) {
      return res.status(400).json({ message: 'Please provide Mobile number and OTP' });
    }
  
    try {
      // Check if user exists with the provided mobile_number and otp
      const runner = await Runnermodel.findOne({ runner_mobile_no, otp });
  
      if (runner) {
        return res.status(200).json({ message: 'Valid runner', runner_id: runner._id });
      } else {
        return res.status(401).json({ message: 'Invalid mobile number or OTP' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error', error });
    }
  });
  
// // Update runner

router.put('/update-runner', async (req, res) => {
  const { _id, runner_mobile_no, runner_email_id, } = req.body;

  if (!_id) {
    return res.status(400).json({ message: 'Please provide the runner ID to update runner details' });
  }

  try {
    const updatedFields = {};
    if (runner_mobile_no) updatedFields.runner_mobile_no = runner_mobile_no;
    if (runner_email_id) updatedFields.runner_email_id = runner_email_id;
   
    // Debugging: Check if _id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid runner ID format' });
    }

    const updatedUser = await Runnermodel.findOneAndUpdate(
      { _id },
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Runner not found' });
    }

    res.status(200).json({ message: 'Runner details are updated successfully', runner: updatedUser });
  } catch (error) {
    console.error('Error updating runner:', error);
    res.status(500).json({ message: 'Error updating runner details', error });
  }
});


router.post('/fetchPickupOrders', async (req, res) => {
  const { runner_id } = req.body;

  if (!runner_id) {
      return res.status(400).json({ message: 'Please provide runner_id' });
  }

  try {
      // Ensure runner_id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(runner_id)) {
          return res.status(400).json({ message: 'Invalid runner_id' });
      }

      // Convert runner_id to ObjectId using new
      const objectId = new mongoose.Types.ObjectId(runner_id);

      // Fetch orders
      const pickupOrders = await OrderModel.find({
          runner_id: objectId,
          delivery_type: 'pickup'
      }).select('_id order_id user_id mobile_no name address remark items order_date pickup_date timeslot Customer_OrderNumber');

      if (pickupOrders.length === 0) {
          return res.status(404).json({ message: 'No pickup orders found for this runner' });
      }

      // Fetch timeslot details
      const timeslotIds = pickupOrders.map(order => order.timeslot);
      const timeslots = await TimeslotModel.find({ _id: { $in: timeslotIds } });

      // Create a map for quick lookup
      const timeslotMap = timeslots.reduce((acc, timeslot) => {
          acc[timeslot._id.toString()] = timeslot.Timeslot;
          return acc;
      }, {});

      // Format the response to include Timeslot and Customer_OrderNumber
      const formattedOrders = pickupOrders.map(order => ({
          _id: order._id,
          order_id: order.order_id,
          user_id: order.user_id,
          mobile_no: order.mobile_no,
          name: order.name,
          address: order.address,
          remark: order.remark,
          items: order.items.map(item => ({
              item_id: item.item_id,
              category_id: item.category_id,
              id_laundrytype: item.id_laundrytype,
              quantity: item.quantity,
              price: item.price,
              weight: item.weight,
              _id: item._id
          })),
          order_date: order.order_date,
          pickup_date: order.pickup_date,
          timeslot: timeslotMap[order.timeslot.toString()], // Include Timeslot field instead of Timeslot_name
          Customer_OrderNumber: order.Customer_OrderNumber // Ensure this field is included
      }));

      res.status(200).json({ pickupOrders: formattedOrders });
  } catch (error) {
      console.error('Error fetching pickup orders:', error.message);
      res.status(500).json({ message: 'Error fetching pickup orders', error: error.message });
  }
});


router.post('/fetchDeliveryOrders', async (req, res) => {
  const { runner_id } = req.body;

  if (!runner_id) {
    return res.status(400).json({ message: 'Please provide runner_id' });
  }

  try {
    // Ensure runner_id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(runner_id)) {
      return res.status(400).json({ message: 'Invalid runner_id' });
    }

    // Convert runner_id to ObjectId using new
    const objectId = new mongoose.Types.ObjectId(runner_id);

    // Fetch delivery orders
    const deliveryOrders = await OrderModel.find({
      runner_id: objectId,
      delivery_type: 'delivery'
    }).select('_id order_id user_id mobile_no name address remark items order_date delivery_date timeslot Customer_OrderNumber');

    if (deliveryOrders.length === 0) {
      return res.status(404).json({ message: 'No delivery orders found for this runner' });
    }

    // Fetch timeslot details
    const timeslotIds = deliveryOrders.map(order => order.timeslot);
    const timeslots = await TimeslotModel.find({ _id: { $in: timeslotIds } });

    // Create a map for quick lookup
    const timeslotMap = timeslots.reduce((acc, timeslot) => {
      acc[timeslot._id.toString()] = timeslot.Timeslot;
      return acc;
    }, {});

    // Format the response to include Timeslot and Customer_OrderNumber
    const formattedOrders = deliveryOrders.map(order => ({
      _id: order._id,
      order_id: order.order_id,
      user_id: order.user_id,
      mobile_no: order.mobile_no,
      name: order.name,
      address: order.address,
      remark: order.remark,
      items: order.items.map(item => ({
        item_id: item.item_id,
        category_id: item.category_id,
        id_laundrytype: item.id_laundrytype,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight,
        _id: item._id
      })),
      order_date: order.order_date,
      delivery_date: order.delivery_date,
      timeslot: timeslotMap[order.timeslot.toString()], // Include Timeslot field
      Customer_OrderNumber: order.Customer_OrderNumber // Ensure this field is included
    }));

    res.status(200).json({ deliveryOrders: formattedOrders });
  } catch (error) {
    console.error('Error fetching delivery orders:', error.message);
    res.status(500).json({ message: 'Error fetching delivery orders', error: error.message });
  }
});


// delete runner

  router.delete('/deleterunner', async (req, res) => {
    const { _id } = req.body;
  
    if (!_id) {
      return res.status(400).json({ message: 'Please provide mobile_no  in the request body' });
    }
    try {
      const deleterunner = await Runnermodel.findOneAndDelete({ _id}); 
      if (!deleterunner) {
        return res.status(404).json({ message: 'Runner not found or already deleted' });
      }
  
      res.status(200).json({ message: 'Runner deleted successfully', Runner: deleterunner });
    } catch (error) {
      console.error('Error deleting Runner:', error);
      res.status(500).json({ message: 'Error deleting Runner', error });
    }
  });

// runner id --> get 
module.exports = router;
