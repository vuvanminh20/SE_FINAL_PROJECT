const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: String,
    sellPrice:Number,
    Qty: Number
});

module.exports = mongoose.model('Product',productSchema);