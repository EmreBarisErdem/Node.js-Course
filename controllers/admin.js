const Product = require('../models/product');
//const Category = require('../models/category');

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

    const product = new Product( name, price,description, imageUrl,null, req.user._id); //req.user._id ile userId bilgisini app.js de tanımladığımız middleware ile alabiliyoruz.

    product.save()
        .then((result) => {
            res.redirect('/admin/products'); //Anasayfaya yönlendirildi.
        }).catch((err) => {
            console.log(err);
        }); 
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
            console.log(product);
            res.render('admin/edit-product',
                {
                    title: 'Edit Product',
                    path: '/admin/products',
                    product: product,
                });
        })
        .catch(err => {
            console.log(err);
        });

   

}

exports.postEditProduct = (req,res,next)=>{

    const id= req.body.id
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    //const categoryid = req.body.categoryid

    const product = new Product(name, price, description,imageUrl, id, req.user._id);

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





























