const router = require('express').Router();
const auth = require('../middleware/jwt');
const groceryController = require("../controller/grocery.controller")

router.get("/{id}", auth.verifyToken, groceryController.getGroceryList);
router.post("/", auth.verifyToken, groceryController.getGroceryList);
router.put("/{id}", auth.verifyToken, groceryController.getGroceryList);
router.delete("/{id}", auth.verifyToken, groceryController.getGroceryList);


router.get("/list", auth.verifyToken, groceryController.getGroceryList);

module.exports = router;