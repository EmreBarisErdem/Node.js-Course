//#region   Sequelize ile....

// const {Sequelize, DataTypes} = require('sequelize');
// const sequelize = require('../Utility/database');

// const User = sequelize.define('user',{
//     id:{
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: DataTypes.STRING,
//     email: DataTypes.STRING
    
// });

//module.exports = User; //User modelini dışarıya açıyoruz

//#endregion


//#region MongoDB ile...
const mongodb = require('mongodb');
const getDb = require('../Utility/database').getDb;

class User{
    constructor(name,email,id){
        this.name = name;
        this.email = email;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save(){
        const db = getDb();

        return db.collection('users')
                .insertOne(this);

    }

    static findById(userid){

        const db = getDb();

        return db.collection('users')
                .findOne({_id: new mongodb.ObjectId(userid)})
                .then(user => {
                    
                    return user;
                })
                .catch(err => {
                    console.log(err);
                });
    }

    static findByName(username){

        const db = getDb();

        return db.collection('users')
                .findOne({name:username})
                .then(user => {
                    return user;
                })
                .catch(err => {
                    console.log(err);
                });
    }
}



module.exports = User;
//#endregion