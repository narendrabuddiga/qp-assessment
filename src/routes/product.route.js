const router = require('express').Router();
const auth = require('../middleware/jwt');
const validator = require('../validator/requestValidator');
const productController = require("../controller/product.controller")

router.get("/list", auth.verifyToken, productController.getProductList);
router.get("/id/:id", auth.verifyToken, validator.validateIdField, productController.getProductById);
router.post("/", auth.verifyToken, auth.isAdmin, validator.addProductReqValidate, productController.addProduct);
router.put("/id/:id", auth.verifyToken, auth.isAdmin, validator.validateIdField, productController.getProductList);
router.delete("/id/:id", auth.verifyToken, auth.isAdmin, validator.validateIdField, productController.removeProductById);

module.exports = router;