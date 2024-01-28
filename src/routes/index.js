const router = require('express').Router();
const authRouter = require('../routes/auth.route');
const productRouter = require("../routes/product.route");
const inventoryRouter = require("../routes/inventory.route")

router.use('/auth', authRouter);
router.use('/grocery', productRouter);
router.use('/inventory', inventoryRouter);

module.exports = router;