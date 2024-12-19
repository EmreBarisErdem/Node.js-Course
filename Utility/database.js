//Sequelize ORM olmadan önce...
//npm install --save mysql2

// const mysql = require('mysql2');

// const connection = mysql.createConnection({
    //     host: 'localhost',
    //     user:'root',
    //     database: 'node-app',
    //     password: '09Haz1992.'
    // });
    
    // module.exports = connection.promise();
    
    
    
    //Sequelize ORM ile....
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-app','root','09Haz1992.',{
    dialect:'mysql',
    host:'localhost'
});

module.exports = sequelize;