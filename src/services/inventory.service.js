const pg = require('../../db/pg/elephantsql');


const getInventoryList = async () => {
    let query = `SELECT * FROM inventories`;
    let response = await pg.query(query);
    return response;
}

module.exports = {
    getInventoryList
}