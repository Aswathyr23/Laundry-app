const express = require('express');
const mongoose = require('mongoose');
const OrderModel = require('../Model/Ordermodel'); // Adjust the path accordingly
const RunnerModel = require('../Model/Runner'); // Adjust the path accordingly

const router = express.Router();

router.put('/assignRunner', async (req, res) => {
  const { order_id, runner_id, runner_mobile_no, delivery_type } = req.body;

  if (!order_id) {
      return res.status(400).json({ message: 'Please provide order_id' });
  }

  try {
      // Construct the update fields based on provided data
      const updateFields = {};

      if (runner_id !== undefined) updateFields.runner_id = runner_id;
      if (runner_mobile_no !== undefined) updateFields.runner_mobile_no = runner_mobile_no;
      if (delivery_type !== undefined) updateFields.delivery_type = delivery_type;

      // Update the order based on order_id and return only the specified fields
      const updatedOrder = await OrderModel.findOneAndUpdate(
          { order_id },
          { $set: updateFields },
          {
              new: true,
              select: 'order_id user_id mobile_no name address pickup_date timeslot delivery_status payment runner_id runner_mobile_no delivery_type' // Project the required fields
          }
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({
          message: 'Runner assigned successfully',
          order: updatedOrder
      });

  } catch (error) {
      console.error('Error in assigning runner:', error.message);
      res.status(500).json({ message: 'Error assigning runner', error: error.message });
  }
});

//updateOrder

router.put('/updateOrder', async (req, res) => {
  const { order_id, delivery_status } = req.body;

  if (!order_id || delivery_status === undefined) {
      return res.status(400).json({ message: 'Please provide order_id and delivery_status' });
  }

  try {
      const updatedOrder = await OrderModel.findOneAndUpdate(
          { order_id },
          { $set: { delivery_status } },
          { new: true, select: 'order_id user_id mobile_no name address pickup_date timeslot delivery_status payment' } // Project only the required fields
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json({
          message: 'Order updated successfully',
          order: updatedOrder
      });

  } catch (error) {
      console.error('Error updating order:', error.message);
      res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

//updating the runner location 
router.put('/updateRunnerLocation', async (req, res) => {
    const { order_id, coordinates } = req.body;
  
    // Validate input
    if (!order_id || !coordinates || !coordinates.latitude || !coordinates.longitude) {
      return res.status(400).json({ message: 'Please provide order_id and valid coordinates' });
    }
  
    try {
      // Update the runner_location field based on order_id
      const updatedOrder = await OrderModel.findOneAndUpdate(
        { order_id },
        { $set: { 'runner_location.coordinates': coordinates } },
        { new: true } // Return the updated document
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({
        message: 'Runner location updated successfully',
        order: updatedOrder
      });
  
    } catch (error) {
      console.error('Error updating runner location:', error.message);
      res.status(500).json({ message: 'Error updating runner location', error: error.message });
    }
  });
  
  


// fetch all the orders associated with a perticular delivery partner

router.post('/getRunnerOrders', async (req, res) => {
    const { runner_mobile_no } = req.body;

    try {
        if (runner_mobile_no) {
            // Find all orders associated with the runner's mobile number
            const orders = await OrderModel.find({ runner_mobile_no });

            if (!orders || orders.length === 0) {
                return res.status(404).json({ message: 'No orders found for this runner' });
            }

            // Return details of the orders
            return res.status(200).json({ orders });
        } else {
            return res.status(400).json({ message: 'runner_mobile_no is required' });
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

router.put('/update_paymentstatus', async (req, res) => {
    const { order_id, payment_status   } = req.body;
  
    if (!order_id || !payment_status) {
        return res.status(400).json({ message: 'Please provide order_id  and payment_status'  });
    }
  
    try {
        // Construct the update fields based on provided data
        const updateFields = {};
  
        if (payment_status !== undefined) updateFields.payment_status = payment_status;
    
  
        // Update the order based on order_id and return only the specified fields
        const updatedOrder = await OrderModel.findOneAndUpdate(
            { order_id },
            { $set: updateFields },
            {
                new: true,
                select: 'order_id user_id mobile_no name address pickup_date timeslot delivery_status payment runner_id runner_mobile_no delivery_type payment_status ' // Project the required fields
            }
        );
  
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
  
        res.status(200).json({
            message: 'Payment status updated  successfully',
            order: updatedOrder
        });
  
    } catch (error) {
        console.error('Error in updating payment status :', error.message);
        res.status(500).json({ message: 'updating payment status ', error: error.message });
    }
  });


module.exports = router;