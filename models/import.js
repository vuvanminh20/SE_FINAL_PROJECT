const mongoose = require('mongoose');

const importSchema = new mongoose.Schema({
    Date: String,
    importList:[{
        Product:{
            type: mongoose.ObjectId,
            ref: 'Product'
        },
        importPrice: Number,
        importQty: Number
    }],
    User:{
        type: mongoose.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Import',importSchema);