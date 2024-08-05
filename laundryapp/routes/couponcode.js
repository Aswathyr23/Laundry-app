const express = require('express');
const CouponcodeModel = require('../Model/Couponcode');

const router = express.Router(); 
// Add coupom

router.post('/create-coupon', async (req, res) => {
    const { code, discount, expiryDate, usageLimit, isActive } = req.body;

    if (!code || !discount || !expiryDate) {
        return res.status(400).json({ message: 'Please provide code, discount, and expiryDate' });
    }
    try {
        // Create a new coupon code
        const newCouponCode = new CouponcodeModel({
            code,
            discount,
            expiryDate,
            usageLimit: usageLimit,
            isActive: isActive !== undefined ? isActive : true
        });

        // Save the coupon code to the database
        await newCouponCode.save();

        res.status(201).json({ message: 'Coupon code created successfully', couponCode: newCouponCode });
    } catch (error) {
        console.error('Error creating coupon code:', error);
        if (error.code === 11000) {  // Handle duplicate key error
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(500).json({ message: 'Error creating coupon code', error });
    }
});

//get coupon

router.get('/get-coupons', async (req, res) => {
    try {
        let coupons;
        if (req.body.code) {
            // If code is provided in the request body, find specific coupon
            const { code } = req.body;
            coupons = await CouponcodeModel.findOne({ code });

            if (!coupons) {
                return res.status(404).json({ message: 'Coupon code not found' });
            }
        } else {
            // If no code provided, get all coupons
            coupons = await CouponcodeModel.find({});
        }

        res.status(200).json({ coupons });
    } catch (error) {
        console.error('Error retrieving coupons:', error);
        res.status(500).json({ message: 'Error retrieving coupons', error });
    }
});

//dlt coupon
router.delete('/delete-coupon', async (req, res) => {
    const { code } = req.body; // Retrieve code from request body

    try {
        const deletedCoupon = await CouponcodeModel.findOneAndDelete({ code });

        if (!deletedCoupon) {
            return res.status(404).json({ message: 'Coupon code not found' });
        }

        res.status(200).json({ message: 'Coupon code deleted successfully', couponCode: deletedCoupon });
    } catch (error) {
        console.error('Error deleting coupon code:', error);
        res.status(500).json({ message: 'Error deleting coupon code', error });
    }
});

module.exports = router;