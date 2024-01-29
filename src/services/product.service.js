const db = require('../db/pg/elephantsql');


const getProductList = async () => {
    let query = `SELECT * FROM supply_management.products`;
    let response = await db.query(query);
    return response;
}

module.exports = {
    getProductList
}