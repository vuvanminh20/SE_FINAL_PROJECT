const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: String,
    sellPrice:Number
});

module.exports = mongoose.model('Product',productSchema);