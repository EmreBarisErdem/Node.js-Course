const mongoose = require('mongoose');
const { isEmail } = require('validator');

const loginSchema = mongoose.Schema({

    email: {
        type: String,
        validate: [isEmail,'Hatalı E-Posta adresi'], 
    },
    password: {
        type: String,
        required: [true,'Şifre alanı boş bırakılamaz'],
    },
})


module.exports = mongoose.model('Login',loginSchema);