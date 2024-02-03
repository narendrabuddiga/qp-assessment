const auth = require('../../middleware/jwt');
const db = require('../../db/pg/elephantsql');

const registerUser = async (payload,userRoleType) => {
    let response = false;
    const { firstname, lastname, password,
        gender, location, mobileNo, email } = payload;
    //encrypt password
    const hashedPassword = await auth.generatePassword(password)

    const client = db.dbClient();
    try {
        await client.query('BEGIN')

        let userInsertQuery = `INSERT INTO supply_management.users 
        (username,firstname,lastname,gender,email) VALUES($1,$2,$3,$4,$5) RETURNING user_id`
        let userValues = [email, firstname, lastname, gender, email];
        let user = await client.query(userInsertQuery, userValues);
        let insertUserSecretsQuery = `INSERT INTO supply_management.user_secrets (USER_ID,PASSKEY) VALUES($1,$2)`
        let userSecretValues = [user.rows[0].user_id, hashedPassword];
        await client.query(insertUserSecretsQuery, userSecretValues)
        if (location) {
            let insertUserAddressQuery = `INSERT INTO supply_management.user_address (USER_ID,LOCATION) VALUES($1,$2)`
            let userAddressValues = [user.rows[0].user_id, location];
            await client.query(insertUserAddressQuery, userAddressValues)
        }
        //roles
        let insertUserRole = `INSERT INTO supply_management.user_roles (USER_ID,ROLE_TYPE) VALUES($1,$2)`
        let userRoles = [user.rows[0].user_id, userRoleType];
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
    let query = `SELECT * FROM supply_management.users u 
     LEFT JOIN supply_management.user_roles ur on u.user_id=ur.user_id
      WHERE u.username= '${email}'`
    let userData = await db.findOne(query);
    return userData
}


const validatedPassword = async (password, userId) => {
    let userSecretQuery = `SELECT * FROM supply_management.user_secrets WHERE user_id= '${userId}'`
    let userSecret = await db.findOne(userSecretQuery);
    return await auth.verfiyPassword(password, userSecret.passkey);
}


module.exports = {
    validatedPassword, registerUser, getUserDataByUsernameOrEmail
}