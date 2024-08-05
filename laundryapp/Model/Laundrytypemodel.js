const mongoose = require('mongoose');

const LaundrytypeSchema = new mongoose.Schema({
  Laundrytype_name: { type: String, required: true },
  Laundrytype_image: { type: String, required: true }
});

const Laundrytype = mongoose.model('Laundrytype', LaundrytypeSchema);

module.exports = Laundrytype;
