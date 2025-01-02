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
    
    
//#region Sequelize ORM ile database bağlantısı
//     //Sequelize ORM ile....
// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('node-app','root','09Haz1992.',{
//     dialect:'mysql',
//     host:'localhost'
// });

// module.exports = sequelize;
//#endregion

//#region MongoDB ile database bağlantısı
//MongoDB için....

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    //MongoClient.connect('mongodb+srv://erdememrebaris:09Haz1992.@cluster0.mgw1v.mongodb.net/node-app') //Atlas'ta çalıştırırken
    MongoClient.connect('mongodb://localhost/node-app') //localde çalıştırırken
        .then(client => {
            console.log('Connected');
            _db = client.db();
            callback(client);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
}

const getDb = () => {
    if(_db){
        return _db;
    }
    throw 'No Database found';
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

//#endregion