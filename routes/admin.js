const express = require('express');
const router = express.Router();
// const path = require('path');
const isAuthenticated = require('../middleware/authentication');
const adminController = require('../controllers/admin');
const csrf = require('../middleware/csrf');

// /admin/products = > GET
router.get('/products',csrf,isAuthenticated, adminController.getProducts);

// /admin/add-product = > GET
router.get('/add-product',csrf,isAuthenticated,adminController.getAddProduct);

// /admin/add-product = > POST
router.post('/add-product',csrf,isAuthenticated,adminController.postAddProduct);

// /admin/products/20 => GET
router.get('/products/:productid',csrf,isAuthenticated,adminController.getEditProduct);

// /admin/products => POST
router.post('/products',csrf,isAuthenticated,adminController.postEditProduct);

router.post('/delete-product',csrf,isAuthenticated,adminController.postDeleteProduct);

router.get('/add-category',csrf,isAuthenticated,adminController.getAddCategory);

router.post('/add-category',csrf,isAuthenticated,adminController.postAddCategory);

router.get('/categories',csrf,isAuthenticated,adminController.getCategories);

router.get('/categories/:categoryid',csrf,isAuthenticated,adminController.getEditCategory);

router.post('/categories',csrf,isAuthenticated,adminController.postEditCategory);

router.post('/delete-category',csrf,isAuthenticated,adminController.postDeleteCategory);

module.exports = router;