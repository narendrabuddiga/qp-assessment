const router = require('express').Router();
const authController = require('../controller/auth.controller');

router.post("/login", authController.loginUser);

router.post("/register", authController.registerUser);

module.exports = router;