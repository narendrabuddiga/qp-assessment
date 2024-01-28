const router = require('express').Router();
const auth = require('../middleware/jwt');
const inventoryController = require("../controller/inventory.controller")

router.get("/list", auth.verifyToken, inventoryController.getInventoryList);

module.exports = router;