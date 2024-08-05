const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: { type: String, required: true, unique: false },
    category_image: { type: String, required: true },
    id_laundrytype: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Laundrytypemodel', required: true }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

