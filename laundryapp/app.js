const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./db'); 
const multer = require('multer')
const path = require('path');

const laundrytypeRoute = require('./routes/laundrytype');
const categoryRoute = require('./routes/category');
const itemRoute = require('./routes/item');
const userRoute = require('./routes/user');
const cartRoute = require('./routes/cart');
const runnerRoute = require('./routes/runner');
const checkoutRoute = require('./routes/checkout');
const CouponCodeRoute = require('./routes/couponcode');
const adminRoute = require('./routes/admin');
const ImageuploadRoute = require('./routes/imageupload'); 
const textRoute = require('./routes/text');
const TransactionmethodRoute= require('./routes/transaction')
const TimeslotRoute= require('./routes/timeslot')

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/api', userRoute);
app.use('/api', laundrytypeRoute);
app.use('/api', categoryRoute);
app.use('/api', itemRoute);
app.use('/api', cartRoute);
app.use('/api', checkoutRoute);
app.use('/api', CouponCodeRoute);
app.use('/api', adminRoute);
app.use('/api', runnerRoute);
app.use('/api', ImageuploadRoute); 
app.use('/api', textRoute); 
app.use('/api', TransactionmethodRoute);
app.use('/api', TimeslotRoute);

app.use('/converted', express.static(path.join(__dirname, 'routes/converted')));
// Serve image directly through the same URL
app.get('/converted/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const options = {
        root: path.join(__dirname, 'routes', 'converted'),
    };

    res.sendFile(imageName, options, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('Image not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});