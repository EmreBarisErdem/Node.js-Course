const Product = require('../models/product');
const Category = require('../models/category');
exports.getProducts = (req,res,next)=>{
    
    Product.getAllProducts()
    .then((products) => {
        res.render('admin/products',
            { 
                title:'Admin Products', 
                products: products[0],
                path : '/admin/products',
                action: req.query.action //Query String ile postEditProduct Methodundan geliyor.
            });
    }).catch((err) => {
        console.log(err);
    });
    
}

exports.getAddProduct = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    Category.getAll()
    .then((categories) => {
        res.render('admin/add-product',
            {
                title: 'New Product',
                path: '/admin/add-product',
                categories: categories[0]
            }); //view engine 'i kullanıyor, view dosyası içerisindeki add-product.pug dosyasını alıyor. // title main-layout ta ki title oluyor.    
    }).catch((err) => {
        console.log(err);
    });
   
}

exports.postAddProduct = (req,res,next)=>{
    //database kayıt işlemleri de yaptırılabilir...
    
    const product = new Product();
    
    product.name = req.body.name;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.categoryid = req.body.categoryid;
    product.description = req.body.description;


    product.saveProduct() //promise döndürüyorr!!!!
    .then(() => {
        res.redirect('/'); //Anasayfaya yönlendirildi.
    }).catch((err) => {
        console.log(err);
    });
    
}



exports.getEditProduct = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    


    Product.getById(req.params.productid)
        .then((product) => {
            Category.getAll()
                .then((categories) => {
                    res.render('admin/edit-product',
                        {
                            title: 'Edit Product',
                            path: '/admin/products',
                            product: product[0][0],
                            categories: categories[0]
                        });
                }).catch((err) => {
                    console.log(err);
                });
            
        }).catch((err) => {
            console.log(err);
        });
   
     //view engine 'i kullanıyor, view dosyası içerisindeki edit-product.pug dosyasını alıyor. // title main-layout ta ki title oluyor.
}

exports.postEditProduct = (req,res,next)=>{

    const product = new Product();

    product.id= req.body.id
    product.name = req.body.name;
    product.price = req.body.price;
    product.imageUrl = req.body.imageUrl;
    product.description = req.body.description;
    product.categoryid = req.body.categoryid
 
    Product.Update(product)
    .then(() => {
        res.redirect('/admin/products?action=edit');
    }).catch((err) => {
        console.log(err)
    });

}

exports.postDeleteProduct = (req,res,next) => {

    Product.DeleteById(req.body.productid)
    .then(() => {
        res.redirect('/admin/products?action=delete');
    }).catch((err) => {
        console.log(err);
    });
    

}





























