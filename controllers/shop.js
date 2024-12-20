const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req,res,next)=>{
    
    Product.findAll({
        attributes:['id','name','price','imageUrl','description']
    })

        .then((products) => {
            Category.findAll()
                .then((categories) => {
                    res.render('shop/index',
                        { 
                            title:'Shopping', 
                            products: products, 
                            categories : categories,
                            path : '/'
                        }); // it renders the shop/index.pug file // title main-layout ta ki title oluyor.    
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProducts = (req,res,next)=>{
    
    Product.findAll({
        attributes: ['id','name','price','imageUrl','description']
    })
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
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProductsByCategoryId = (req,res,next)=>{
    const categoryid = req.params.categoryid;
    const products = Product.getProductsByCategoryId(categoryid);
    const categories = Category.getAll();

    res.render('shop/products',
        { 
            title:'Products', 
            products: products, 
            categories : categories,
            path : '/products',
            selectedCategory: categoryid
        }); // it renders the shop/product.pug file // title main-layout ta ki title oluyor.
}

exports.getCart = (req,res,next)=>{
    const products = Product.getAllProducts();
    res.render('shop/cart',
        { 
            title:'Cart', 
            products: products, 
            path : '/cart'
        }); // it renders the shop/cart.pug file // title main-layout ta ki title oluyor.
}

exports.getOrders = (req,res,next)=>{
    const products = Product.getAllProducts();
    res.render('shop/orders',
        { 
            title:'Orders', 
            products: products, 
            path : '/orders'
        }); // it renders the shop/orders.pug file // title main-layout ta ki title oluyor.
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






















