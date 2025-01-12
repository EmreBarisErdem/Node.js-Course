const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req,res,next)=>{
    
    Product.findAll()
        .then((products) => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/index',
                        { 
                            title:'Shopping', 
                            products: products, 
                            categories : categories,
                            path : '/'
                        }); // it renders the shop/index.pug file // title main-layout ta ki title oluyor.    
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProducts = (req,res,next)=>{
    
    Product.findAll()
        .then((products) => {
            Category.findAll()
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
}

exports.getProductsByCategoryId = (req,res,next)=>{
    const categoryid = req.params.categoryid;
    const modal = [];

    Category.findAll()
        .then(categories => {
            modal.categories = categories;
            return Product.findByCategoryId(categoryid);

            // const category = categories.find(i => i.id == categoryid);
            // return category.getProducts(); //getProducts sequelize tarafından otomatik olarak oluşturulmuş bir fonksiyon ve ilişkili olan productları getirir.
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
        .getCart()
        .then(products => {
            res.render('shop/cart',
                { 
                    title:'Cart', 
                    path : '/cart',
                    products: products
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
    req.user
        .getOrders({ include : ['products']}) //include ile ilişkili olan productları da getiriyoruz.
        .then(orders => {
            console.log(orders);
            res.render('shop/orders',
                { 
                    title:'Orders',
                    path : '/orders',
                    orders: orders

                }); // it renders the shop/orders.pug file // title main-layout ta ki title oluyor.   
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

    req.user
        .addOrder()
        .then(()=>{
            res.redirect('/cart');
        })
        .catch(err=>console.log(err));

}

exports.postCartItemDelete = (req,res,next)=>{
    //#region Sequielize ile...
    
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
    
    Product.findAll(
        { 
            attributes:['id','name','price','imageUrl','description'],       
            where: { id: req.params.productid }
        })
        .then((products) => {
                
            res.render('shop/product-detail',{
                title: products[0].name,
                product: products[0],
                path: '/products'
            });
        }).catch((err) => {
            console.log(err);
        });
    
    //or
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






















