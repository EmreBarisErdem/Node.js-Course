const Product = require('../models/product');
const Category = require('../models/category');
const Order = require('../models/order')

exports.getIndex = (req,res,next)=>{
    //#region MongoDB ile
    // Product.findAll()
    //     .then((products) => {
    //         Category.findAll()
    //             .then(categories => {
    //                 res.render('shop/index',
    //                     { 
    //                         title:'Shopping', 
    //                         products: products, 
    //                         categories : categories,
    //                         path : '/'
    //                     }); // it renders the shop/index.pug file // title main-layout ta ki title oluyor.    
    //             });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

    //#endregion
    //#region Mongoose ile...
    //console.log(req.isAuthenticated); => null döner
    console.log(req.cookies.isAuthenticated);
    
    Product.find()
    .then(products => {
        return products;
    })
    .then(products => {
        Category.find()
            .then(categories => {
                res.render('shop/index',
                    { 
                        title:'Shopping', 
                        products: products, 
                        categories : categories,
                        path : '/',
                        isAuthenticated: req.cookies.isAuthenticated === 'true'
                    }); // it renders the shop/index.pug file // title main-layout ta ki title oluyor.    
            });
    })
    .catch((err) => {
        console.log(err);
    });
    //#endregion

}

exports.getProducts = (req,res,next)=>{
    //#region MongoDb ile...
    // Product.findAll()
    // .then((products) => {
    //     Category.findAll()
    //         .then((categories) => {
    //             res.render('shop/products',
    //                 { 
    //                     title:'Products', 
    //                     products: products, 
    //                     categories : categories,
    //                     path : '/'
    //                 }); // it renders the shop/product.pug file // title main-layout ta ki title oluyor. 
    //         });
    // })
    // .catch((err) => {
    //     console.log(err);
    // });

    //#endregion
    
    //#region Mongoose ile...

    //Query Operatörleri....

    //eq (equal)
    //ne (not equal)
    //gt (greater than)
    //gte (greater than or equal)
    //lt (less than)
    //lte (less than or equal)
    //in 
    //nin (not in)

    Product
        .find()
        //#region Mongoose methodları...
        // .find({price: {$eq: 2000}})
        // .find({price: {$ne: 2000}})
        // .find({price: {$gt: 2000}})
        // .find({price: {$gte: 2000}})
        // .find({price: {$lt: 2000}})
        // .find({price: {$lte: 2000}})
        // .find({price: {$in: [1000,2000,3000]}})
        // .find({price: {$gte: 1000, $lte: 2000}})
        // .or([{price: {$gte: 2000}, name: 'Samsung S6'}])
       
        // starts with
        // .find({name: /^Samsung/})

        // ends with
        // .find({name: /Samsung$/})

        // contains
        //find({name:/.*Samsung.*/})
        //#endregion    
        .then((products) => {
            return products;
        })
        .then(products => {
            Category.find()
                .then((categories) => {
                    res.render('shop/products',
                        { 
                            title:'Products', 
                            products: products, 
                            categories : categories,
                            path : '/'
                        }); // it renders the shop/product.pug file // title main-layout ta ki title oluyor. 
                });
        })
        .catch((err) => {
            console.log(err);
        });
    //#endregion
}

exports.getProductsByCategoryId = (req,res,next)=>{
    const categoryid = req.params.categoryid;
    const modal = [];

    //#region MongoDB ile...
    // Category.findAll()
    //     .then(categories => {
    //         modal.categories = categories;
    //         return Product.findByCategoryId(categoryid);

    //         // const category = categories.find(i => i.id == categoryid);
    //         // return category.getProducts(); //getProducts sequelize tarafından otomatik olarak oluşturulmuş bir fonksiyon ve ilişkili olan productları getirir.
    //     })
    //     .then(products => {
    //         res.render('shop/products',
    //             { 
    //                 title:'Products', 
    //                 products: products, 
    //                 categories : modal.categories, //dışarda modal diye bir dizi oluşturmuştum çünkü categoriese ulaşmam gerekiyor.
    //                 selectedCategory: categoryid,
    //                 path : '/products'
    //             }); // it renders the shop/product.pug file // title main-layout ta ki title oluyor.
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });        

        //#endregion


    Category.find()
        .then(categories => {
            modal.categories = categories;
            return Product.find({categories: categoryid});
        })
        .then(products => {
            res.render('shop/products',
                { 
                    title:'Products', 
                    products: products, 
                    categories : modal.categories, //dışarda modal diye bir dizi oluşturmuştum çünkü categoriese ulaşmam gerekiyor.
                    selectedCategory: categoryid,
                    path : '/products'
                }); // it renders the shop/product.pug file // title main-layout ta ki title oluyor.
        })
        .catch((err) => {
            console.log(err);
        });        
}

exports.getCart = (req,res,next)=>{
    
    req.user
        //.getCart() //user modeli içerisinde tanımlandı...
        .populate('cart.items.productId') // bu şekilde userın cart nesnesinin içindeki items dizisi içerisindeki productlara ulaşabiliyorum
        //.execPopulate() //Mongoose kütüphanesinde kullanılan bir methoddur ve populate() methodunun çalıştırılmasını sağlar. 
        .then(user => {
            res.render('shop/cart',
                { 
                    title:'Cart', 
                    path : '/cart',
                    products: user.cart.items
                }); // it renders the shop/cart.pug file // title main-layout ta ki title oluyor.
        })
        .catch((err) => {console.log(err);});

}

exports.postCart = (req,res,next)=>{
    //#region Cart modeli ile
    // const productId = req.body.productId; 
    // let quantity = 1;
    // let userCart;

    //     req.user.getCart() 
    //         .then(cart => {
    //             userCart = cart;
    //             return cart.getProducts({where: {id:productId}}) //cartItem tablosunda product var mı kontrol ediliyor.
    //             .then((products)=>{
    //                 let product;
    //                 if(products.length > 0){
    //                     product = products[0]; //product[0] ile product tablosundaki productı alıyorum.
    //                 }
    //                 if(product){ //eğer product varsa product'ın quantity'sini arttırıyorum.
    //                     quantity += product.cartItem.quantity;
                        
    //                    return product;
    //                 }
    //                 return Product.findByPk(productId); //eğer product yoksa product tablosundan yani database den product'ı alıyorum ve promise olarak döndürüyorum.
    //             })
    //             .then(product => { // product oluşturulduktan sonra cartItem tablosuna eklenmesi gerekiyor.
    //                 userCart.addProduct(product,  //cartItem tablosuna ekleniyor.
    //                     {through: {quantity: quantity}
    //                 }); 
    //             })
    //             .then(() => {
    //                 res.redirect('/cart');
    //             })
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });

            //#endregion
    
    const productId = req.body.productId;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(()=> {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    
}

exports.getOrders = (req,res,next)=>{
    
    //#region sequelize ile...
    // req.user
    //     .getOrders({ include : ['products']}) //include ile ilişkili olan productları da getiriyoruz.
    //     .then(orders => {
    //         console.log(orders);
    //         res.render('shop/orders',
    //             { 
    //                 title:'Orders',
    //                 path : '/orders',
    //                 orders: orders

    //             }); // it renders the shop/orders.pug file // title main-layout ta ki title oluyor.   
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    //#endregion
    //#region MongoDb ile....
    // req.user
    //     .getOrders()
    //     .then(orders => {
    //         res.render('shop/orders',
    //             { 
    //                 title:'Orders',
    //                 path : '/orders',
    //                 orders: orders

    //             });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    //#endregion

    //#region Mongoose ile...
    Order.find({'user.userId':req.user._id})
        .then(orders => {
            console.log(orders);
            res.render('shop/orders',
                { 
                    title:'Orders',
                    path : '/orders',
                    orders: orders

                });
        })
        .catch((err) => {
            console.log(err);
        });
    //#endregion

}

exports.postOrder = (req,res,next)=>{
    //#region Sequelize ile...
    // let userCart;

    // req.user
    // .getCart()
    //     .then(cart => {
    //         userCart = cart;
    //         return cart.getProducts();
    //     })
    //     .then(products => {
    //         req.user.createOrder()
    //             .then(order => {    
    //                 return order.addProducts(products.map(product => {
    //                     product.orderItem = {
    //                         quantity: product.cartItem.quantity,
    //                         price: product.price
    //                     };
                        
    //                     return product;
    //                 }))
    //             })
    //             .catch((err) => {
    //                 console.log(err);
    //             });
    //     })
    //     .then(() => {
    //         userCart.setProducts(null);
    //     })
    //     .then(() => {
    //         res.redirect('/orders');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
        //#endregion
   
    //#region MongoDb ile...
    // req.user
    //     .addOrder()
    //     .then(()=>{
    //         res.redirect('/cart');
    //     })
    //     .catch(err=>console.log(err));

    //#endregion

    //#region Mongoose ile
    req.user
        .populate('cart.items.productId')
        .then((user)=>{
            const order = new Order({
                user: {
                    userId: req.user._id,
                    name: req.user.name,
                    email: req.user.email
                },
                items: user.cart.items.map(p=> {

                    return {
                        product: {
                            _id: p.productId._id,
                            name: p.productId.name,
                            price: p.productId.price,
                            imageUrl: p.productId.imageUrl
                        },
                        quantity: p.quantity
                    };
                })
            });
            return order.save();
           
        })
        .then(()=>{
            //cart temizlenir...

            return req.user.clearCart();

        })
        .then(()=>{
            res.redirect('/orders');
        })
        .catch(err=>console.log(err));
    //#endregion
}

exports.postCartItemDelete = (req,res,next)=>{
    //#region Sequelize ile...
    
    // const productId= req.body.productid;

    // req.user.getCart()
    //     .then(cart => {
    //         return cart.getProducts({where: {id: productId}});
    //     })
    //     .then(products => {
    //         const product = products[0];
    //         return product.cartItem.destroy();
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });

        //#endregion

        const productid = req.body.productid;

        req.user
            .deleteCartItem(productid)
            .then(()=>{
                res.redirect('/cart');
            });


}

exports.getProduct = (req,res,next)=>{
    
    Product
        //.findOne({ _id: req.params.productid}) kritere uyan ilk kayıtı getirir.
        .findById(req.params.productid)
            .then((product) => {
                    
                res.render('shop/product-detail',{
                    title: product.name,
                    product: product,
                    path: '/products'
                });
            }).catch((err) => {
                console.log(err);
            });
        
    //or with sequelize...
    // Product.findByPk(req.params.productid)
    //     .then((product) => {
            
    //         res.render('shop/product-detail',{
    //             title: product.name,
    //             product: product,
    //             path: '/products'
    //         });
    //     }).catch((err) => {
    //         console.log(err);
    //     });
}






















