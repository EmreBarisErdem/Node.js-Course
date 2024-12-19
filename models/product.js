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
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../Utility/database');

const Product = sequelize.define('product',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: DataTypes.STRING,
    price:{
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull:true
    }
});

module.exports = Product;