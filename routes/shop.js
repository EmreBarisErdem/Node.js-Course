const express = require('express');
const router = express.Router();
// const path = require('path');
const isAuthenticated = require('../middleware/authentication');
const shopController = require('../controllers/shop');
const locals = require('../middleware/locals');

router.get('/',locals, shopController.getIndex);

router.get('/products',locals, shopController.getProducts);

//dinamik olmayan yapıları dinamik yapıların üstüne almazsan çalışmaz
// router.get('/products/delete',shopController.getProducts);

//products/15125 => Dinamik bir yapı o yüzden products ile başlayanların en altında yer alıyor.
// router.get('/products/productid',shopController.getProducts);

router.get('/products/:productid',locals, shopController.getProduct);

router.get('/categories/:categoryid',locals, shopController.getProductsByCategoryId);

router.get('/cart',locals,isAuthenticated, shopController.getCart);

router.post('/cart',locals,isAuthenticated, shopController.postCart);

router.post('/delete-cartitem',locals,isAuthenticated, shopController.postCartItemDelete);

router.get('/orders',locals,isAuthenticated, shopController.getOrders);

router.post('/create-order',locals,isAuthenticated, shopController.postOrder);


module.exports = router;