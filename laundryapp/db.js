const mongoose = require('mongoose');

mongoose.connect('mongodb://laundry:F2ZbCYMMyNSiPFHb@172.105.53.74:27017/laundry?authSource=laundry', {
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

module.exports = mongoose;
