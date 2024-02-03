const router = require('express').Router();
const auth = require('../middleware/jwt');
const validator = require('../validator/requestValidator');
const orderController = require('../controller/order.controller');

router.post("/createorder", auth.verifyToken,validator.createOrderValidate, orderController.createOrder);
router.get("/list", auth.verifyToken, orderController.getUserOrderList);
router.get("/id/:id", auth.verifyToken,validator.validateIdField, orderController.getUserOrderById);

module.exports = router;