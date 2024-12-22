const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../Utility/database');

const User = sequelize.define('user',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING
    
});

module.exports = User; //User modelini dışarıya açıyoruz