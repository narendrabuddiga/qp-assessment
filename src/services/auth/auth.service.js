const bcrypt = require("bcrypt");
const pg = require('../../db/pg/elephantsql');

const registerUser = async (payload) => {
    let response = false;
    const {firstname, lastname, password,
        gender, location, mobileNo, email } = payload;
    //encrypt password
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const ifUserNameExist = await getUserDataByUsernameOrEmail(email);
    if (ifUserNameExist) {
        return response;
    }

    const client = pg.pgClient();
    try {
        await client.query('BEGIN')

        let userInsertQuery = `INSERT INTO user_management.users 
        (username,firstname,lastname,gender,email) VALUES($1,$2,$3,$4,$5) RETURNING user_id`
        let userValues = [email, firstname, lastname, gender, email];
        let user = await client.query(userInsertQuery, userValues);
        let insertUserSecretsQuery = `INSERT INTO user_management.user_secrets (USER_ID,PASSKEY) VALUES($1,$2)`
        let userSecretValues = [user.rows[0].user_id, hashedPassword];
        await client.query(insertUserSecretsQuery, userSecretValues)
        if (location) {
            let insertUserAddressQuery = `INSERT INTO user_management.user_address (USER_ID,LOCATION) VALUES($1,$2)`
            let userAddressValues = [user.rows[0].user_id, location];
            await client.query(insertUserAddressQuery, userAddressValues)
        }
        //roles
        let insertUserRole = `INSERT INTO user_management.user_role (USER_ID,ROLE) VALUES($1,$2)`
        let userRoles = [user.rows[0].user_id, "USER_ROLE"];
        await client.query(insertUserRole, userRoles)
        await client.query('COMMIT');
        response = true;
    } catch (error) {
        console.error("Error:", error)
        await client.query('ROLLBACK')
    }
    return response;
}

const getUserDataByUsernameOrEmail = async (email) => {
    let query = `SELECT * FROM user_management.users WHERE username= '${email}'`
    let userData = await pg.findOne(query);
    return userData
}

const createUser = async (payload) => {
    const { username, firstname, lastname, password, gender, location, mobileNo } = payload;
    let insertUser = `INSERT INTO user_management.users(USERNAME,FIRSTNAME,LASTNAME,GENDER) 
    VALUE (${username},${firstname},${lastname},${gender})`;
    let userData = await pgClient.findOne(query);
    return userData
}

const validatedPassword = async (password, userId) => {
    let userSecretQuery = `SELECT * FROM user_management.user_secrets WHERE user_id= '${userId}'`
    let userSecret = await pg.findOne(userSecretQuery);
    return await bcrypt.compare(password, userSecret.passkey)
}


module.exports = {
    validatedPassword, registerUser, getUserDataByUsernameOrEmail
}