const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    Date: String,
    Address: String,
    Phone: String,
    orderList:[{
        Product:{
            type: mongoose.ObjectId,
            ref: 'Product'
        },
        importQty: Number
    }],
    User:{
        type: mongoose.ObjectId,
        ref: 'User'
    },
    totalPayment: Number,
    paymentType: String,
    paymentStatus: Number,
    deliveryStatus:Number,
    Edit:{
        type: mongoose.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Order',orderSchema);