const express = require('express');
const router = express.Router();
// const path = require('path');
const isAuthenticated = require('../middleware/authentication');
const shopController = require('../controllers/shop');
const csrf = require('../middleware/csrf');

router.get('/',csrf, shopController.getIndex);

router.get('/products',csrf, shopController.getProducts);

//dinamik olmayan yapıları dinamik yapıların üstüne almazsan çalışmaz
// router.get('/products/delete',shopController.getProducts);

//products/15125 => Dinamik bir yapı o yüzden products ile başlayanların en altında yer alıyor.
// router.get('/products/productid',shopController.getProducts);

router.get('/products/:productid',csrf, shopController.getProduct);

router.get('/categories/:categoryid',csrf, shopController.getProductsByCategoryId);

router.get('/cart',csrf,isAuthenticated, shopController.getCart);

router.post('/cart',csrf,isAuthenticated, shopController.postCart);

router.post('/delete-cartitem',csrf,isAuthenticated, shopController.postCartItemDelete);

router.get('/orders',csrf,isAuthenticated, shopController.getOrders);

router.post('/create-order',csrf,isAuthenticated, shopController.postOrder);


module.exports = router;