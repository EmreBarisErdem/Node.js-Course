//Express.js (Web Frameworkü)(DB servisine bağlanma işlemleri)

//Request ve Response objelerini oluşturur.

const express = require('express');
const app = express(); //express aslında bir fonksiyon ama onu objeye set edip kullanıyorum.
const bodyParser = require('body-parser');
const path = require('path');
//https://expressjs.com/en/4x/api.html#app.set
// app.set('title', 'My Site'); //set ettiğimiz değeri daha sonra get metodu ile alabiliyoruz.
// console.log(app.get('title')); // "My Site"
//https://expressjs.com/en/guide/using-template-engines.html
app.set('view engine','pug'); //view engine tanımlı bir ifade... 
app.set('views','./views'); 

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/errors');
const mongoConnect = require('./Utility/database').mongoConnect;
// const sequelize = require('./Utility/database');

// const Category = require('./models/category');
// const Product = require('./models/product');
 const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cartItem');
// const Order = require('./models/order');
// const OrderItem = require('./models/orderItem');

//#region body parser middleware

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
//#endregion

//#region user bilgisini her requestte göndermek için middleware oluşturuyoruz.

app.use((req,res,next) => { 
    User.findByName('sadikturan')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            console.log(req.user) 
            next();
        })
        .catch(err => console.log(err));
});
//#endregion

//#region User bilgisini her requestte göndermek için middleware oluşturuyoruz.

// app.use((req, res, next) => { // her requestte çalışacak olan middleware
//     User.findByPk(1) // Assuming having a user with ID 1
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err));
// });
//#endregion


//Model ve tablolar arasındaki ilişkileri tanımlamak için
//Product ve Category arasında ilişki kurulması...
//Product.HasOne(Category);
// Product.belongsTo(Category,{
//     foreingKey: {
//         allowNull:false, //categoryid boş geçilemez.
//     }
// }); //Product tablosu Category tablosuna bağlıdır.
// Category.hasMany(Product); //Category tablosu Product tablosuna bağlıdır.
// //ikisinide kullanabiliriz veya birini de kullanabilirim.

// Product.belongsTo(User);
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);

// Cart.belongsToMany(Product, {through: CartItem});
// Product.belongsToMany(Cart, {through: CartItem});

// Order.belongsTo(User);
// User.hasMany(Order);

// Order.belongsToMany(Product, {through: OrderItem});
// Product.belongsToMany(Order, {through: OrderItem});

/*sequelize database bağlantısı testi...

sequelize
    .authenticate()
    .then(()=>{
        console.log('Connection has been established successfully.');
    })
    .catch (err => {
        console.error('Unable to connect to the database:', error);
    });
*/
//#region bütün modellerimi database'e göndermek için...
//
// let _user;
// sequelize
// //.sync({force:true}) //force:true yaparak her seferinde tabloları silip tekrar oluşturuyoruz.
// .sync()
// .then(() => {
//     User.findByPk(1) // Assuming having a user with ID 1
//         .then(user => {
//             if(!user){
//                 return User.create({name:'sadikturan',email:'email@gmail.com'});
//             }
//             return user;
//         })
//         .then(user => {
//             _user = user;
//             return user.getCart(); 
//         })
//         .then(cart => {
//             if(!cart){
//                 return _user.createCart();
//             }
//             return cart;
//         })
//         .then(() => {
//             Category.count() //Category tablosunda kaç tane kayıt var onu sayar.
//                 .then((count) => {
//                     if(count === 0){
//                         Category.bulkCreate([ //bulkCreate birden fazla kayıt eklemek için kullanılır.
//                             {name: 'Telefon', description:'telefon kategorisi'},
//                             {name: 'Bilgisayar', description:'bilgisayar kategorisi'},
//                             {name: 'Elektronik', description:'elektronik kategorisi'}
//                         ]);
//                     }
//                 })
//         })
// })
// .catch((err) => {
//     console.log(err);
// });
//#endregion

//routes
app.use('/admin',adminRoutes); //admin ön ekini ekleyerek adrese her defasında ekleme yapmak zorunda kalmıyoruz.
app.use(shopRoutes);

app.use(errorController.get404Page);
// app.get('/',(req,res)=>{
//     res.send('Hello World');
// })

// app.get('/api/products',(req,res)=>{
//     res.send('ürünler listelendi');
// })


//Middlewares ..........................................
// app.use((req,res,next)=>{
//     console.log("middleware 1 çalıştırıldı.");
//     next(); //bir sonraki middleware'e devam et..
// })

// app.use((req,res,next)=>{
//     console.log("middleware 2 çalıştırıldı");
//     //... Geriye response döndürmek lazım...
//     res.send('<h1>hello from express.js</h1>');

// });




//Routing.......................................

// app.use('/add-product',(req,res,next)=>{
//     res.send('<h1>adding product page</h1>');
// });

// app.use('/product-list',(req,res,next)=>{
//     res.send('<h1>product listing page</h1>');
// });

// app.use('/',(req,res,next)=>{
//     res.send('<h1>hello from express.js</h1>');
// });

mongoConnect(() => {

    User.findByName('sadikturan')
        .then(user => {
            if(!user){
                user = new User('sadikturan', 'email@gmail.com');
                return user.save();
            }
            return user;
        }
    )
    .then((user) => {
        console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });



});

// app.listen(3000,()=>{
//     console.log('listening on port 3000');
// });



