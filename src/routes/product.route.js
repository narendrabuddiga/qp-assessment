const router = require('express').Router();
const auth = require('../middleware/jwt');
const productController = require("../controller/product.controller")

router.get("/{id}", auth.verifyToken, productController.getProductList);
router.post("/", auth.verifyToken, productController.getProductList);
router.put("/{id}", auth.verifyToken, productController.getProductList);
router.delete("/{id}", auth.verifyToken, productController.getProductList);


router.get("/list", auth.verifyToken, productController.getProductList);

module.exports = router;