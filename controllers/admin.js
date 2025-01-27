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
    //.populate('userId') // komple userId yerine user nesnesini getirir.
    .populate('userId','name -_id')// user nesnesinin sadece name 'ini getirmek istersek
    .select('name price imageUrl userId')
    .then((products) => {
        console.log(products)
        res.render('admin/products',
            { 
                title:'Admin Products', 
                products: products,
                path : '/admin/products',
                action: req.query.action, //Query String ile postEditProduct Methodundan geliyor.
                isAuthenticated: req.session.isAuthenticated 
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
        isAuthenticated: req.session.isAuthenticated
    }); //view engine 'i kullanıyor, view dosyası içerisindeki add-product.pug dosyasını alıyor. // title main-layout ta ki title oluyor.    

    
    
}

exports.postAddProduct = (req,res,next)=>{
   
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;

    //MongoDB ile...
    // const product = new Product( name, price,description, imageUrl,null, req.user._id); //req.user._id ile userId bilgisini app.js de tanımladığımız middleware ile alabiliyoruz.
    const product = new Product(
    {
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user

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
    //#region Sequielize ile...

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
    
    //#region  Mongoose ile...
    Product.findById(req.params.productid)
        //.populate('categories') 
        .then(product => {
            console.log(product);
            return product;
        })
        .then(product => {
            Category.find()
                .then(categories => {

                    categories = categories.map(category=> {
                        
                        if(product.categories){
                            product.categories.find(item=>{
                                if(item.toString() === category._id.toString()){
                                    category.selected = true;
                                }
                            })
                        }
                        
                        return category;
                    })

                    res.render('admin/edit-product',
                        {
                            title: 'Edit Product',
                            path: '/admin/products',
                            product: product,
                            categories: categories,
                            isAuthenticated: req.session.isAuthenticated
                        });
                });
        })
        .catch(err => console.log(err));

    //#endregion
}

exports.postEditProduct = (req,res,next)=>{

    //query firts
    //update first

    const id= req.body.id
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const ids = req.body.categoryids;

    //#region Mongoose ile...
    // Product.findById(id)
    //     .then(product => {
    //         product.name = name;
    //         product.price = price;
    //         product.imageUrl = imageUrl;
    //         product.description = description;
    //         return product.save();

    //     })
    //     .then(()=>{
    //         res.redirect('/admin/products?action=edit');
    //     })
    //     .catch(err => console.log(err));


    //or you can use this...

        Product.findOneAndUpdate({_id:id},{
            $set: {
                name: name,
                price: price,
                imageUrl: imageUrl,
                description: description,
                categories : ids
            }
        })
        .then(()=>{
            res.redirect('/admin/products?action=edit');
        })
        .catch(err => console.log(err));

    //#endregion

    //#region MongoDB ile...
    // const product = new Product(name, price, description,imageUrl, id, req.user._id,categories);

    // product.save()
    //     .then((result) => {
    //         res.redirect('/admin/products?action=edit');
    //     }).catch((err) => {
    //         console.log(err);
    //     });
    //#endregion
    

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

    //#region Mongoose İle...
    //or .findByIdAndRemove
    //or .deleteMany eğer birden fazla kayıt silmek istersek
    Product.deleteOne({_id:id})
        .then(() => {
            console.log('Product Has Been Deleted!');
            res.redirect('/admin/products?action=delete'); // asenkron olduğu için burada redirect yapılmalı. Çünkü catch'den sonra aşağıda redirect yapılırsa işlem tamamlanmadan sayfaya yönlendirilir.
        })
        .catch((err) => {
            console.log(err);
        });
    //#endregion
    //#region MongoDb ile...

    // Product.deleteById(id)
    //     .then(() => {
    //         console.log('Product Has Been Deleted!');
    //         res.redirect('/admin/products?action=delete'); // asenkron olduğu için burada redirect yapılmalı. Çünkü catch'den sonra aşağıda redirect yapılırsa işlem tamamlanmadan sayfaya yönlendirilir.
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    //#endregion
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
    
    //#region Mongoose ile...

    Category.find()
        .then(categories => {
            res.render('admin/categories',
            {
                title:'Categories', 
                path : '/admin/categories',
                categories: categories,
                action: req.query.action,
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch((err) => {
            console.log(err);
        });


    //#endregion

    //#region MongoDb ile...
    // Category.findAll()
    //     .then(categories => {
    //         res.render('admin/categories',
    //         {
    //             title:'Categories', 
    //             path : '/admin/categories',
    //             categories: categories,
    //             action: req.query.action
    //         });
    //     })
    //     .catch((err) => {
    //         console.log(err);
    //     });
    //#endregion
}

exports.getAddCategory = (req,res,next) => {

    res.render('admin/add-category',{
        title: 'New Category',
        path: '/admin/add-category',
        isAuthenticated: req.session.isAuthenticated
    });


}

exports.postAddCategory = (req,res,next) => {

    const name = req.body.name;
    const description = req.body.description;
    
    //MongoDb ile..
    //const category = new Category(name,description,null);
    
    //#region Mongoose ile
    const category = new Category({
        name: name,
        description: description

    })

    category.save()
        .then(() => {
            res.redirect('/admin/categories?action=create');
        }).catch(err => console.log(err));
    //#endregion
    


}

exports.getEditCategory = (req,res,next) => {
    
    //#region Mongoose ile...
    Category.findById(req.params.categoryid)
        .then((category) => {
            res.render('admin/edit-category',{
                title: 'Edit Category',
                category : category,
                path: '/admin/categories',
                isAuthenticated: req.session.isAuthenticated
            });
        }).catch((err) => {
            console.log(err);
        });
    //#endregion

    //#region MongoDB ile...
    // Category.findById(req.params.categoryid)
    //     .then((category) => {
    //         res.render('admin/edit-category',{
    //             title: 'Edit Category',
    //             category : category,
    //             path: '/admin/categories'
    //         });
    //     }).catch((err) => {
    //         console.log(err);
    //     });

    //#endregion


}

exports.postEditCategory = (req,res,next) => {

    const name = req.body.name
    const description = req.body.description
    const id = req.body.id

    //#region Mongoose ile..
    Category.findOneAndUpdate({_id:id},{
        $set: {
            name:name,
            description:description
        }
    })
    .then(()=>{
        res.redirect('/admin/categories?action=edit')
    }).catch(err => console.log(err));
    //#endregion

    //#region MongoDb ile...
    // const category = new Category(name,description,id)

    // category.save()
    //     .then(() => {
    //         res.redirect('/admin/categories?action=edit')
    //     }).catch((err) => {
    //         console.log(err);
    //     });

    //#endregion
}

exports.postDeleteCategory = (req,res,next) =>{

    const id = req.body.categoryid;

    Category.deleteOne({_id:id})
        .then(()=>{
            console.log('Category has been deleted!')
            res.redirect('/admin/categories?action=delete');
        })
        .catch(err=>console.log(err));


}






















