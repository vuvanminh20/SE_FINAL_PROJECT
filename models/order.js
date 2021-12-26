const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    User:{
        type: mongoose.ObjectId,
        ref: 'User'
    },
    Date: String,
    Address: String,
    Phone: String,
    orderList:[{
        Product:{
            type: mongoose.ObjectId,
            ref: 'Product'
        },
        Qty: Number
    }],
    totalPayment: Number,
    paymentType: String,
    paymentStatus: Number,
    deliveryStatus:Number,
    Edit:{
        type: mongoose.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Order',orderSchema);