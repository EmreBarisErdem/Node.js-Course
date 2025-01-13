const Category = require('../models/category');
const Product = require('../models/product');

exports.getProducts = (req,res,next)=>{
    
    //#region MongoDB ile...
    // Product.findAll()
    // .then((products) => {
    //     res.render('admin/products',
    //         { 
    //             title:'Admin Products', 
    //             products: products,
    //             path : '/admin/products',
    //             action: req.query.action //Query String ile postEditProduct Methodundan geliyor.
    //         });
    // }).catch((err) => {
    //     console.log(err);
    // });
    //#endregion
    
    //#region Mongoose ile...
    Product.find()
    //.limit(10) //10 adet getir.
    //.sort({price:1}) //price ' e göre sıralanmış bir şekilde getirir.
    //.select({name:1,price:1}) //sadece name ve price sütunlarını getirir.
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
    //#endregion

}

exports.getAddProduct = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    
    res.render('admin/add-product',{
        title: 'New Product',
        path: '/admin/add-product',
    }); //view engine 'i kullanıyor, view dosyası içerisindeki add-product.pug dosyasını alıyor. // title main-layout ta ki title oluyor.    

    
    
}

exports.postAddProduct = (req,res,next)=>{
   
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

    //MongoDB ile...
    // const product = new Product( name, price,description, imageUrl,null, req.user._id); //req.user._id ile userId bilgisini app.js de tanımladığımız middleware ile alabiliyoruz.
    const product = new Product({
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description

    })

    //Mongoose ile... https://mongoosejs.com/docs/guides.html
    product.save()
        .then(() => {
            res.redirect('/admin/products'); //Anasayfaya yönlendirildi.
        }).catch((err) => {
            console.log(err);
        }); 


    //Mongo DB ile...
    // product.save()
    //     .then((result) => {
    //         res.redirect('/admin/products'); //Anasayfaya yönlendirildi.
    //     }).catch((err) => {
    //         console.log(err);
    //     }); 
}

exports.getEditProduct = (req,res,next)=>{
    // res.sendFile(path.join(__dirname,'../','views','add-product.html'));
    //#region 

    // Product.findByPk(req.params.productid)
    //     .then((product) => {
    //         if(!product){
    //             return res.redirect('/');
    //         }
    //         Category.findAll()
    //             .then((categories) => {
    //                 res.render('admin/edit-product',
    //                     {
    //                         title: 'Edit Product',
    //                         path: '/admin/products',
    //                         product: product,
    //                         categories: categories
    //                     });
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
            
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    //view engine 'i kullanıyor, view dosyası içerisindeki edit-product.pug dosyasını alıyor. // title main-layout ta ki title oluyor.
   //#endregion
    
    Product.findById(req.params.productid)
        .then(product => {
            Category.findAll()
                .then(categories => {
                    // categories
                    categories = categories.map(category => { 
                        if(product.categories){ //productın bir categorisi var ise
                            product.categories.find(item => {
                                if(item == category._id){
                                    category.selected = true;
                                }
                            })
                        }
                        return category
                    })

                    res.render('admin/edit-product',
                        {
                            title: 'Edit Product',
                            path: '/admin/products',
                            product: product,
                            categories: categories
                        });
                });
        })
        .catch(err => console.log(err));
}

exports.postEditProduct = (req,res,next)=>{

    const id= req.body.id
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categories = req.body.categoryids;

    const product = new Product(name, price, description,imageUrl, id, req.user._id,categories);

    product.save()
        .then((result) => {
            res.redirect('/admin/products?action=edit');
        }).catch((err) => {
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

    Product.deleteById(id)
        .then(() => {
            console.log('Product Has Been Deleted!');
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

exports.getCategories = (req,res,next) => {
    
    Category.findAll()
        .then(categories => {
            res.render('admin/categories',
            {
                title:'Categories', 
                path : '/admin/categories',
                categories: categories,
                action: req.query.action
            });
        })
        .catch((err) => {
            console.log(err);
        });

}

exports.getAddCategory = (req,res,next) => {

    res.render('admin/add-category',{
        title: 'New Category',
        path: '/admin/add-category'
    });


}

exports.postAddCategory = (req,res,next) => {

    const name = req.body.name;
    const description = req.body.description;

    const category = new Category(name,description,null);

    category.save()
        .then(result => {

            console.log(result);

            res.redirect('/admin/categories?action=create');
            
        }).catch(err => console.log(err));

    


}

exports.getEditCategory = (req,res,next) => {

    Category.findById(req.params.categoryid)
        .then((category) => {
            res.render('admin/edit-category',{
                title: 'Edit Category',
                category : category,
                path: '/admin/categories'
            });
        }).catch((err) => {
            console.log(err);
        });
}

exports.postEditCategory = (req,res,next) => {

    const name = req.body.name
    const description = req.body.description
    const id = req.body.id

    const category = new Category(name,description,id)

    category.save()
        .then(() => {
            res.redirect('/admin/categories?action=edit')
        }).catch((err) => {
            console.log(err);
        });
}























