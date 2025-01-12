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
    constructor(name,email,cart,id){
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : {};
        this.cart.items = cart ? cart.items : [] ;
        this._id = id ? new mongodb.ObjectId(id) : null;
    }

    save(){
        const db = getDb();

        return db.collection('users')
                .insertOne(this);

    }

    getCart(){
        //kullanıcının kartında olan bütün ürünlerin productId lerini geriye bir dizi olarak döndürür.
        const ids = this.cart.items.map(i=> { 
            return i.productId;
        });

        //console.log(ids); // dizi şeklinde gelir.

        const db = getDb();

        return db.collection('products')
                    .find({_id: {$in: ids}})
                    .toArray()
                    .then(products => {
                        return products.map(p=>{
                            return {
                                ...p,
                                quantity: this.cart.items.find(i=> {
                                   return i.productId.toString() === p._id.toString();
                                }).quantity
                            }
                        });
                    })
        
    }

    addToCart(product){
        
        const index = this.cart.items.findIndex(cp=> {
            return cp.productId.toString() === product._id.toString();
        })
        
        const updatedCartItems = [...this.cart.items];
        let itemQuantity = 1;

        //cart zaten eklenmek istenen product varsa: quantity'i arttır.
        if(index >= 0){
            itemQuantity = this.cart.items[index].quantity + 1;
            updatedCartItems[index].quantity = itemQuantity;
        } 
        else{
            // updatedCartItems'a yeni bir eleman ekle
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: itemQuantity
            });
        }

        const db = getDb();

        return db.collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set : {cart: {items: updatedCartItems } } },
        );
            
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