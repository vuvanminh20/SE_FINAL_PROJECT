const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    userRole: String
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, 8);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

module.exports = mongoose.model('User',userSchema);