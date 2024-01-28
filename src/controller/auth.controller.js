const authService = require('../services/auth/auth.service');
const jwt = require('../middleware/jwt');

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const userData = await authService.getUserDataByUsername(username);//check user exists in db
    if (userData) {
        let verfiyPassword = await authService.validatedPassword(password, userData.user_id);
        if (verfiyPassword) {
            const token = jwt.generateToken(userData.user_id)
            let response = { ...userData, ...token }
            res.status(200).send(response);
        } else {
            res.status(400).send('Invalid Username or Password');
        }
    } else {
        res.status(400).send(`Invalid Username or Password`);
    }
}

const registerUser = async (req, res) => {
    let response = await authService.registerUser(req.body);
    if (response) {
        res.status(200).send("User Registered Successfully");
    } else {
        res.status(500).send("User Registered Failed");
    }
}

module.exports = {
    loginUser, registerUser
}