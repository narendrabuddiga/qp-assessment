const router = require('express').Router();
const auth = require('../middleware/jwt');
const inventoryController = require("../controller/inventory.controller")

router.get("/list", auth.verifyToken, inventoryController.getInventoryList);

router.post("", auth.verifyToken, inventoryController.addInventory);
router.put("/{id}", auth.verifyToken, inventoryController.updateInventory);

module.exports = router;