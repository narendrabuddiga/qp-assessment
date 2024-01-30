const router = require('express').Router();
const authController = require('../controller/auth.controller');
const validator = require('../validator/requestValidator');

router.post("/login", validator.loginRequestValidate, authController.loginUser);

router.post("/register", validator.registerRequestValidate, authController.registerUser);

module.exports = router;