const router = require('express').Router();
const auth = require('../middleware/jwt');
const orderController = require('../controller/order.controller');

router.post("/create", auth.verifyToken, orderController.createOrder);
router.get("/list", auth.verifyToken, orderController.createOrder);

module.exports = router;