const jwt = require("jsonwebtoken");
const User = require('../models/user');
const ms = require('ms');

async function getToken(email) {
    return new Promise((resolve, reject) => {
        // Generate reset token
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Check User in the database and save token
        User.findOne({ email: email })
            .then((user) => {
                if (!user) {
                    return reject(new Error("Kullanıcı bulunamadı."));
                }
                user.resetToken = resetToken;
                user.resetTokenExpiration = Date.now() + ms(process.env.JWT_EXPIRES_IN); // Use 'ms' to parse the expiration time

                return user.save();
            })
            .then(() => {
                resolve(resetToken);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = getToken;