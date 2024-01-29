const db = require('../db/pg/elephantsql');


const getInventoryList = async () => {
    let query = `SELECT * FROM supply_management.inventories`;
    let response = await db.query(query);
    return response;
}

module.exports = {
    getInventoryList
}