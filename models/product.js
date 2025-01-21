// const connection = require('../Utility/database');

// module.exports = class Product{

//     constructor(name,price,imageUrl,description,categoryid){
//         this.id = (Math.floor(Math.random()*99999)+1).toString();
//         this.name = name;
//         this.price = price;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.categoryid = categoryid;
//     }

//     saveProduct(){
//         return connection.execute('INSERT INTO products (name, price, imageUrl, description,categoryid) VALUES ( ?, ?, ?, ?, ?)',[this.name,this.price,this.imageUrl,this.description,this.categoryid]);
//     }

//     static getAllProducts(){
//         return connection.execute('SELECT * FROM products');
//     }

//     static getById(id){
//         return connection.execute('SELECT * FROM products WHERE products.id =?',[id]);
//     }

//     static getProductsByCategoryId(categoryid){
        
//     }

//     static Update(product){
//        return connection.execute('UPDATE products SET products.name=?,products.price=?,products.imageUrl=?,products.description=?,products.categoryid=? WHERE products.id=?',[product.name,product.price,product.imageUrl,product.description,product.categoryid,product.id]);
        
//     }

//     static DeleteById(id){
//         return connection.execute('DELETE FROM products WHERE id=?',[id]);

//     }
// }

//#region Sequelize ile model oluşturulması

// const {Sequelize, DataTypes} = require('sequelize');
// const sequelize = require('../Utility/database');

// const Product = sequelize.define('product',{
//     id:{
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: DataTypes.STRING,
//     price:{
//         type: DataTypes.DOUBLE,
//         allowNull: false
//     },
//     imageUrl: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     description:{
//         type: DataTypes.STRING,
//         allowNull:true
//     }
    
// });

//module.exports = Product;
//#endregion

//#region MongoDB ile Product Modeli

// const mongodb = require('mongodb');
// const getDb = require('../Utility/database').getDb;

// class Product{
//     constructor(name,price,description,imageUrl,id, userId, categories){
//         this.name = name;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//         this.categories = (categories && !Array.isArray(categories) ? Array.of(categories): categories); //Eğer productin categorisinin null olmadığı veya birden fazla categorisi olmadığı durumda yani tek bir kategori seçilmiş ise onu diziye çeviren ki kontrol mekanizması.  

//     }

//     save() {
//         let db = getDb();

//         if(this._id){
//             db = db.collection('products')
//             .updateOne({_id: this._id},{$set: this});
//         }
//         else{
//             db = db.collection('products')
//             .insertOne(this)
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
//         return db.collection('products')
//             .find()
//             .toArray()
//             .then((products) => {
//                 return products;
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }

//     static findById(productid){
//         const db = getDb();
//         // return db.collection('products')
//         //     .find({_id: new mongodb.ObjectId(productid)})
//         //     .toArray()
//         //     .then((products) => {
//         //         return products;
//         //     })
//         //     .catch((err) => {
//         //         console.log(err);
//         //     });
//         //OR
//         return db.collection('products')
//             .findOne({_id: new mongodb.ObjectId(productid)})
//             .then((product) => {
//                 return product;
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     }

//     static deleteById(productid){
//         const db = getDb();
//         return db.collection('products')
//                 .deleteOne({_id: new mongodb.ObjectId(productid)})
//                 .then(() => {
//                     console.log('Product Has Been Deleted!');
//                 })
//                 .catch((err) => {
//                     console.log(err);
//                 });

//     }

//     static findByCategoryId(categoryid){
//         const db = getDb();

//         return db.collection('products')
//             .find({categories: categoryid})
//             .toArray()
//             .then(products => {
//                 return products;
//             })
//             .catch(err => console.log(err))
//     }

// }

// module.exports = Product;

//#endregion

//#region Mongoose ORM ile...
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    price: {
        type: Number,
        required: true
    },
    description: String,
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    //tags: [String]
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User tablosu ile ilişkilendirme
        require: true
    },
    categories: [ //dizi olduğuna dikkat et!
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Category Tablosu ile ilişkilendirme
        require : false
        }
    ]
    
});


module.exports = mongoose.model('Product', productSchema); // database de products

//#endregion