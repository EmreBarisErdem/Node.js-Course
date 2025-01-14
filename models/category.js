/*Without ORM tool

const connection = require('../Utility/database');

module.exports = class Category{
    constructor(name,description){
        this.id = (categories.length + 1).toString();
        this.name = name;
        this.description = description;
    }

    saveCategory(){
        return connection.execute('INSERT INTO categories(name,description) VALUES(?,?)',[this.name,this.description]);
    }

    static getAll(){
        return connection.execute('SELECT * FROM categories')
    }

    static getById(id) {
        return connection.execute('SELECT * FROM categories WHERE id=?',[id]);
    }

    static Update(category){
        return connection.execute('UPDATE categories SET categories.name=?,categories.description=?',[category.name,category.description]);
    }

    static deleteById(id){
        return connection.execute('DELETE FROM categories WHERE id=?',[id]);
    }

}
*/


//#region With Sequelize ORM Tool

// const {Sequelize, DataTypes} = require('sequelize');
// const sequelize = require('../Utility/database');

// const Category = sequelize.define('category',{
//     id:{
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: DataTypes.STRING,
//     description:{
//         type: DataTypes.STRING,
//         allowNull:true
//     }
// });

// module.exports = Category;

//#endregion

//#region With MongoDB
// const mongodb = require('mongodb');
// const getDb = require('../Utility/database').getDb;

// class Category{
//     constructor(name,description,id){
//         this.name = name;
//         this.description = description;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }

//     save(){
//         let db = getDb();

//         if(this._id){
//             db = db.collection('categories')
//             .updateOne({_id: this._id},{$set: this});
//         }
//         else{
//             db = db
//                 .collection('categories')
//                 .insertOne(this)
//         }

//         return db
//             .then((result) => {
//                 console.log(result);   
//             }).catch((err) => {
//                 console.log(err);
//             });
//     }

//     static findAll(){
//         const db = getDb();

//         return db.collection('categories')
//             .find()
//             .toArray()
//             .then((categories) => {
//                 return categories;
//             })
//             .catch((err) => {console.log(err)});
            
//     }

//     static findById(categoryid){
//         const db = getDb();

//         return db.collection('categories')
//             .findOne({_id: new mongodb.ObjectId(categoryid)})
//             .then((category) => {
//                 return category;   
//             })
//             .catch((err) => {console.log(err)});
//     }

//     static deleteById(categoryid){

//         const db = getDb();

//         return db.collection('categories')
//             .deleteOne({_id: new mongodb.ObjectId(categoryid)})
//             .then(() => {
//                 console.log("Product has been deleted!");
//             })
//             .catch((err) => {console.log(err)});
//     }
// }

// module.exports = Category;

//#endregion


//#region Mongoose ile...
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Category', categorySchema);
//#endregion