const express = require('express');
const router = express.Router();
// const path = require('path');

const adminController = require('../controllers/admin');

// /admin/products = > GET
router.get('/products',adminController.getProducts);


// /admin/add-product = > GET
router.get('/add-product',adminController.getAddProduct);

// /admin/add-product = > POST
router.post('/add-product',adminController.postAddProduct);

// /admin/products/20 => GET
router.get('/products/:productid',adminController.getEditProduct);

// /admin/products => POST
router.post('/products',adminController.postEditProduct);

router.post('/delete-product',adminController.postDeleteProduct);

router.get('/add-category',adminController.getAddCategory);

router.post('/add-category',adminController.postAddCategory);

router.get('/categories',adminController.getCategories);

module.exports = router;