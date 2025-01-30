const express = require('express');
const router = express.Router();
// const path = require('path');
const isAdmin = require('../middleware/isAdmin');
const adminController = require('../controllers/admin');
const locals = require('../middleware/locals');

// /admin/products = > GET
router.get('/products',locals,isAdmin, adminController.getProducts);

// /admin/add-product = > GET
router.get('/add-product',locals,isAdmin,adminController.getAddProduct);

// /admin/add-product = > POST
router.post('/add-product',locals,isAdmin,adminController.postAddProduct);

// /admin/products/20 => GET
router.get('/products/:productid',locals,isAdmin,adminController.getEditProduct);

// /admin/products => POST
router.post('/products',locals,isAdmin,adminController.postEditProduct);

router.post('/delete-product',locals,isAdmin,adminController.postDeleteProduct);

router.get('/add-category',locals,isAdmin,adminController.getAddCategory);

router.post('/add-category',locals,isAdmin,adminController.postAddCategory);

router.get('/categories',locals,isAdmin,adminController.getCategories);

router.get('/categories/:categoryid',locals,isAdmin,adminController.getEditCategory);

router.post('/categories',locals,isAdmin,adminController.postEditCategory);

router.post('/delete-category',locals,isAdmin,adminController.postDeleteCategory);

module.exports = router;