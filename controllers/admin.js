const Product = require('../models/product');
const Category = require('../models/category');

exports.getProducts = (req,res,next)=>{
    
    Product.findAll()
    .then((products) => {
        res.render('admin/products',
            { 
                title:'Admin Products', 
                products: products,
                path : '/admin/products',
                action: req.query.action //Query String ile postEditProduct Methodundan geliyor.
            });
    }).catch((err) => {
        console.log(err);
    });
    
}

exports.getAddProduct = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    
    Category.findAll()
        .then((categories) => {
            res.render('admin/add-product',{
                title: 'New Product',
                path: '/admin/add-product',
                categories : categories
            }); //view engine 'i kullanıyor, view dosyası içerisindeki add-product.pug dosyasını alıyor. // title main-layout ta ki title oluyor.    
        
        })
        .catch((err) => {
            console.log(err);
        });
    
    
}

exports.postAddProduct = (req,res,next)=>{
    //database kayıt işlemleri.. 
    
    
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryid = req.body.categoryid;

    req.user.createProduct({ //promise döndürüyorr!!!! //Sequelize ile export edildi.
        name : name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        categoryId: categoryid
    })
    .then((result) => {
        console.log('Product Created!');
        res.redirect('/'); //Anasayfaya yönlendirildi.
    }).catch((err) => {
        console.log(err);
    }); 
}

exports.getEditProduct = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    
    Product.findByPk(req.params.productid)
        .then((product) => {
            if(!product){
                return res.redirect('/');
            }
            Category.findAll()
                .then((categories) => {
                    res.render('admin/edit-product',
                        {
                            title: 'Edit Product',
                            path: '/admin/products',
                            product: product,
                            categories: categories
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

    const id= req.body.id
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryid = req.body.categoryid
 
    Product.findByPk(id)
        .then((product) => {
            product.name = name;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            product.categoryId = categoryid;
            return product.save()
                
        })
        .then(result => {
            console.log('Product Updated!');
            res.redirect('/admin/products?action=edit');
        })
        .catch((err) => {
            console.log(err);
        });

    //or you can use the following
    // Product.Update(product)
    // .then(() => {
    //     res.redirect('/admin/products?action=edit');
    // }).catch((err) => {
    //     console.log(err)
    // });

}

exports.postDeleteProduct = (req,res,next) => {

    const id = req.body.productid;

    Product.findByPk(id)
        .then((product) => {
            return product.destroy();
        })
        .then(() => {
            console.log('Product Deleted!');
            res.redirect('/admin/products?action=delete'); // asenkron olduğu için burada redirect yapılmalı. Çünkü catch'den sonra aşağıda redirect yapılırsa işlem tamamlanmadan sayfaya yönlendirilir.
        })
        .catch((err) => {
            console.log(err);
        });

    //or you can use the following
    // Product.destroy({ where: { id: id } })
    //     .then(() => {
    //         console.log('Product Deleted!');
    //         res.redirect('/admin/products?action=delete');
    //     }).catch((err) => {
    //         console.log(err);
    //     });

    //or
    // Product.DeleteById(req.body.productid)
    // .then(() => {
    //     res.redirect('/admin/products?action=delete');
    // }).catch((err) => {
    //     console.log(err);
    // });
    

}





























