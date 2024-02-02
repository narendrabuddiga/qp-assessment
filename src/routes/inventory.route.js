const router = require('express').Router();
const auth = require('../middleware/jwt');
const validator = require('../validator/requestValidator');
const inventoryController = require("../controller/inventory.controller")

router.get("/list", auth.verifyToken, auth.isAdmin, inventoryController.getInventoryList);
router.get("/id/:id", auth.verifyToken, auth.isAdmin, validator.validateIdField, inventoryController.getInventoryById);
router.post("", auth.verifyToken, auth.isAdmin, validator.createInventory,inventoryController.addInventory);
router.put("/id/:id", auth.verifyToken, auth.isAdmin, validator.updateInventoryValidate, inventoryController.updateInventory);

module.exports = router;