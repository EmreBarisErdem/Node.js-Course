const {Sequelize,DataTypes} = require('sequelize');

const sequelize = require('../Utility/database');

const OrderItem = sequelize.define('orderItem',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE

});

module.exports = OrderItem;