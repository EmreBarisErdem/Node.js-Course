const express = require('express');
const router = express.Router();
// const path = require('path');

const shopController = require('../controllers/shop');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

//dinamik olmayan yapıları dinamik yapıların üstüne almazsan çalışmaz
// router.get('/products/delete',shopController.getProducts);

//products/15125 => Dinamik bir yapı o yüzden products ile başlayanların en altında yer alıyor.
// router.get('/products/productid',shopController.getProducts);

router.get('/products/:productid', shopController.getProduct);

router.get('/categories/:categoryid', shopController.getProductsByCategoryId);

router.get('/cart', shopController.getCart);

router.get('/orders', shopController.getOrders);


module.exports = router;