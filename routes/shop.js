const express = require('express');
const router = express.Router();
// const path = require('path');
const isAuthenticated = require('../middleware/authentication');
const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//dinamik olmayan yapıları dinamik yapıların üstüne almazsan çalışmaz
// router.get('/products/delete',shopController.getProducts);

//products/15125 => Dinamik bir yapı o yüzden products ile başlayanların en altında yer alıyor.
// router.get('/products/productid',shopController.getProducts);

router.get('/products/:productid', shopController.getProduct);

router.get('/categories/:categoryid', shopController.getProductsByCategoryId);

router.get('/cart',isAuthenticated, shopController.getCart);

router.post('/cart',isAuthenticated, shopController.postCart);

router.post('/delete-cartitem',isAuthenticated, shopController.postCartItemDelete);

router.get('/orders',isAuthenticated, shopController.getOrders);

router.post('/create-order',isAuthenticated, shopController.postOrder);


module.exports = router;