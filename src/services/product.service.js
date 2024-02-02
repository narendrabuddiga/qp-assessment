const { dbClient, findAll ,findOne} = require('../db/pg/elephantsql');


const getProductList = async () => {
    let query = `SELECT * FROM supply_management.products`;
    let response = await findAll(query);
    return response;
}

const getProductById = async (id) => {
    let query = `SELECT * FROM supply_management.products where product_id=${id}`;
    let response = await findOne(query);
    return response;
}

const addProduct = async (payload, user) => {
    let response = {
        status: "success"
    };
    const { name, type, description,
        unitName, unitValue, unitPrice, currency } = payload;
    const client = dbClient();
    try {
        await client.query('BEGIN')
        let insertQuery = `INSERT INTO supply_management.products 
        (name,description,type,unit_name,unit_value,unit_price,currency,created_by) 
        VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING product_id`;
        let values = [name, description, type, unitName, unitValue, unitPrice, currency, user.id];
        let product = await client.query(insertQuery, values);
        await client.query('COMMIT');
        response.productId = product.rows[0]?.product_id;
    } catch (error) {
        console.error("Error:", error)
        await client.query('ROLLBACK');
        response.status = "failed";
        response.message = error?.message;
    }
    return response;
}


module.exports = {
    getProductList, addProduct, getProductById
}