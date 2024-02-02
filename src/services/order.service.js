const { findAll } = require('../db/pg/elephantsql');


const createOrder = async (payload, user) => {
    let query = `SELECT * FROM supply_management.orders`;
    let response = await findAll(query);
    return response;
}

const getOrderList = async (req, res) => {
    let query = `SELECT * FROM supply_management.orders`;
    let response = await findAll(query);
    return response;
}

module.exports = {
    createOrder, getOrderList
}