const router = require('express').Router();
const authRouter = require('../routes/auth.route');
const groceryRouter = require("../routes/grocery.route");
const inventoryRouter = require("../routes/inventory.route")

router.use('/auth', authRouter);
router.use('/grocery', groceryRouter);
router.use('/inventory', inventoryRouter);

module.exports = router;