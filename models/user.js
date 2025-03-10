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

// const mongodb = require('mongodb');
// const getDb = require('../Utility/database').getDb;

// class User{
//     constructor(name,email,cart,id){
//         this.name = name;
//         this.email = email;
//         this.cart = cart ? cart : {};
//         this.cart.items = cart ? cart.items : [] ;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//     }

//     save(){
//         const db = getDb();

//         return db.collection('users')
//                 .insertOne(this);

//     }

//     getCart(){
//         //kullanıcının kartında olan bütün ürünlerin productId lerini geriye bir dizi olarak döndürür.
//         const ids = this.cart.items.map(i=> { 
//             return i.productId;
//         });

//         //console.log(ids); // dizi şeklinde gelir.

//         const db = getDb();

//         return db.collection('products')
//                     .find({_id: {$in: ids}})
//                     .toArray()
//                     .then(products => {
//                         return products.map(p=>{
//                             return {
//                                 ...p,
//                                 quantity: this.cart.items.find(i=> {
//                                    return i.productId.toString() === p._id.toString();
//                                 }).quantity
//                             }
//                         });
//                     })
        
//     }

//     addToCart(product){
        
//         const index = this.cart.items.findIndex(cp=> {
//             return cp.productId.toString() === product._id.toString();
//         })
        
//         const updatedCartItems = [...this.cart.items];
//         let itemQuantity = 1;

//         //cart zaten eklenmek istenen product varsa: quantity'i arttır.
//         if(index >= 0){
//             itemQuantity = this.cart.items[index].quantity + 1;
//             updatedCartItems[index].quantity = itemQuantity;
//         } 
//         else{
//             // updatedCartItems'a yeni bir eleman ekle
//             updatedCartItems.push({
//                 productId: new mongodb.ObjectId(product._id),
//                 quantity: itemQuantity
//             });
//         }

//         const db = getDb();

//         return db.collection('users')
//             .updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set : {cart: {items: updatedCartItems } } },
//         );
            
//     }

//     static findById(userid){

//         const db = getDb();

//         return db.collection('users')
//                 .findOne({_id: new mongodb.ObjectId(userid)})
//                 .then(user => {
                    
//                     return user;
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//     }

//     static findByName(username){

//         const db = getDb();

//         return db.collection('users')
//                 .findOne({name:username})
//                 .then(user => {
//                     return user;
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//     }

//     deleteCartItem(productid){

//         // cart taki ürünlerden productId'si silinecek productid olmayan ürünleri geri getirir.
//         const cartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productid.toString()
            
//         });

//         const db = getDb();

//         return db.collection('users')
//                     .updateOne(
//                         { _id : new mongodb.ObjectId(this._id) },
//                         { $set : { cart: { items: cartItems } } },
//                     )
//     }


//     addOrder(){
//         //1) get cart
//         //2) create order object
//         //3) save order
//         //4) update cart

//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products.map(item=>{
//                         return {
//                             _id:item._id,
//                             name: item.name,
//                             price: item.price,
//                             imageUrl: item.imageUrl,
//                             userId: item.userId,
//                             quantity: item.quantity
//                         }
//                     }),
//                     user: {
//                         _id: new mongodb.ObjectId(this._id),
//                         name: this.name,
//                         email: this.email,
//                     },
//                     date: new Date().toLocaleString()
//                 }
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(()=>{
//                 this.cart = {items: []};
//                 return db.collection('users')
//                     .updateOne(
//                         {_id: new mongodb.ObjectId(this._id)},
//                         { $set : { cart : { items: []}}}
//                     );
                            
//             });

//     }

//     getOrders(){
//         const db = getDb();

//         return db.collection('orders')
//             .find({'user._id': new mongodb.ObjectId(this._id)})
//             .toArray();
//     }

// }


// module.exports = User;
//#endregion


//#region Mongoose ile...

const mongoose = require('mongoose');
const Product = require('./product');
const { isEmail } = require('validator');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        // validate: {
        //     validator: function(value){
        //         return '/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}'.test(value); //regular expression of email validation
        //     }
        // }
        validate: [isEmail,'Invalid Email'], // validator package'dan gelir.
        
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : 'Product', //product tablosunda reference key olduğunu belirtiyoruz
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
})

userSchema.methods.addToCart = function(product) {
        const index = this.cart.items.findIndex(cp => {
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
                productId: product._id, //Mongoose bunu ObjectId ye çeviriyor
                quantity: itemQuantity
            });
        }

        this.cart = {
            items: updatedCartItems
        }
        return this.save();

}

userSchema.methods.getCart = function() {

        //kullanıcının kartında olan bütün ürünlerin productId lerini geriye bir dizi olarak döndürür.
        const ids = this.cart.items.map(i=> { 
            return i.productId; //map methodu dizi olarak geri döner.
        });

        return Product
                .find({_id: {$in: ids}}) // ids dizisi içerisndeki eşleşen id değerli productları geriye dizi olarak döndürecek..
                .select('name price imageUrl')
                .then(products => {
                    return products.map(p=>{
                        return {
                            name: p.name,
                            price: p.price,
                            imageUrl: p.imageUrl,
                            quantity: this.cart.items.find(i=> {
                                return i.productId.toString() === p._id.toString();
                            }).quantity
                        }
                    });
                })


}

userSchema.methods.deleteCartItem = function(productid) {

    const cartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productid.toString()
        
    });

    this.cart.items = cartItems;

    return this.save();



}

userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save();
}



module.exports = mongoose.model('User',userSchema);

//#endregion
