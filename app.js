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
// const sequelize = require('./Utility/database');
const errorController = require('./controllers/errors');
//body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
//routes
app.use('/admin',adminRoutes); //admin ön ekini ekleyerek adrese her defasında ekleme yapmak zorunda kalmıyoruz.
app.use(shopRoutes);
/*
connection.execute('SELECT * FROM products')
    .then((result) => {
        console.log(result[0]);
    }).catch((err) => {
        console.log(err);
    });

*/

//sequelize database bağlantısı testi...
// sequelize
//     .authenticate()
//     .then(()=>{
//         console.log('Connection has been established successfully.');
//     })
//     .catch (err => {
//         console.error('Unable to connect to the database:', error);
//     });
  

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


//Body Parser...........................................


app.listen(3000,()=>{
    console.log('listening on port 3000');
});



