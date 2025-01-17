//#region Sequelize ile...

// const {Sequelize,DataTypes} = require('sequelize');

// const sequelize = require('../Utility/database');

// const Order = sequelize.define('order',{
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     }

// });

// module.exports = Order;

//#endregion

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user:{
        userId: {
            type: mongoose.Types.ObjectId,
            required:true,
            ref:'User'
        },
        name: {
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },
    items:[
        {
            product: {
                type: Object,
                required: true
            },
            //product nesnesi yerine de yazılabilir.
            // name:{
            //     type: String,
            //     required: true
            // },
            // price:{
            //     type: String,
            //     required: true
            // },
            // imageUrl:{
            //     type:String,
            //     required: true
            // },
            quantity:{
                type:Number,
                required: true
            }
            
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Order', orderSchema);