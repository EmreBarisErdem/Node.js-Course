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
const { isLowercase } = require('validator');

const productSchema = mongoose.Schema({
    name: {
        type:String,
        required: [true,'Ürün ismi girmelisiniz'], // Eğer girilmezse hata mesajı
        minlength: [5,'Ürün ismi en az 5 karakter olmalıdır.'], // Eğer girilen değer 5 karakterden az ise hata mesajı
        maxlength: [255,'Ürün ismi en fazla 255 karakter olmalıdır.'], // Eğer girilen değer 255 karakterden fazla ise hata mesajı
        lowercase: true, // Girilen değeri küçük harfe çevirir.
        trim: true,
    },
    price: {
        type: Number,
        required: function() {
            return this.isActive;
        },
        min: 0,
        max: 10000,
        get: value => Math.round(value), // Get metodu ile değeri alırken değeri yuvarlar
        set: value => Math.round(value) // Set metodu ile database e kaydederken değeri yuvarlar

    },
    description: {
        type: String,
        minlength: 10,
    },
    imageUrl: String,
    date: {
        type: Date,
        default: Date.now
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User tablosu ile ilişkilendirme
        require: true
    },
    tags: {
        type: Array,
        validate: {
            validator: function(value) {
                return value && value.length > 0;
            },
            message: 'A product should have at least one tag.'
        }
    },
    isActive: {
        type: Boolean,
        default: false
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