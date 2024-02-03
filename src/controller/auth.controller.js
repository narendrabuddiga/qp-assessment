const authService = require('../services/auth/auth.service');
const jwt = require('../middleware/jwt');

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const userData = await authService.getUserDataByUsernameOrEmail(username);//check user exists in db
    if (userData) {
        let verfiyPassword = await authService.validatedPassword(password, userData.user_id);
        if (verfiyPassword) {
            const token = jwt.generateToken(userData.user_id, userData.role_type)
            let response = { ...token }
            res.status(200).send(response);
        } else {
            res.status(400).send('Invalid Username or Password');
        }
    } else {
        res.status(400).send(`Invalid Username or Password`);
    }
}

const registerUser = async (req, res) => {
    const ifUserNameExist = await authService.getUserDataByUsernameOrEmail(req.body.email);
    if (ifUserNameExist) {
        res.status(200).send("User or email already registered");
    } else {
        let userRoleType = req.originalUrl.includes('admin') ? "ADMIN_ROLE" : "CUSTOMER";
        let response = await authService.registerUser(req.body, userRoleType);
        if (response) {
            res.status(200).send("User Registered Successfully");
        } else {
            res.status(500).send("User Registered Failed");
        }
    }
}

module.exports = {
    loginUser, registerUser
}