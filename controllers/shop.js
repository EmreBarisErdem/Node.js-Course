const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req,res,next)=>{
    
    const categories = Category.getAll();

    Product.getAllProducts()
    .then((products) => {
        res.render('shop/index',
            { 
                title:'Shopping', 
                products: products[0], 
                categories : categories,
                path : '/'
            }); // it renders the shop/index.pug file // title main-layout ta ki title oluyor.
    }).catch((err) => {
        console.log(err);
    });

    
} 

exports.getProducts = (req,res,next)=>{
    
    const categories = Category.getAll();

    Product.getAllProducts()
    .then((products) => {
        res.render('shop/products',
            { 
                title:'Products', 
                products: products[0], 
                categories : categories,
                path : '/'
            }); // it renders the shop/product.pug file // title main-layout ta ki title oluyor.
    }).catch((err) => {
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
    Product.getById(req.params.productid)
        .then((product) => {
            
            res.render('shop/product-detail',{
                title: product[0][0].name,
                product: product[0][0],
                path: '/products'
            });
        }).catch((err) => {
            console.log(err);
        });
}






















