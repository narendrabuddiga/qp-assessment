const pg = require('../../db/pg/elephantsql');


const getProductList = async () => {
    let query = `SELECT * FROM products`;
    let response = await pg.query(query);
    return response;
}

module.exports = {
    getProductList
}