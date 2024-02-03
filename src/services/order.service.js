const { dbClient, findAll, findOne } = require('../db/pg/elephantsql');
const { getProductQuantityListByIds } = require('./product.service');
const format = require('pg-format');

const createOrder = async (payload, user) => {
    let response = {
        status: "success"
    };
    const { groceries, totalPrice } = payload;
    let productIds = groceries.map(x => x.id);
    let productListExistDb = await getProductQuantityListByIds(productIds);
    if (groceries && groceries.length > 0 && groceries.length != productListExistDb.length) {
        response.status = "failed";
        response.message = "mismatch grocery Ids"
        return response
    }
    const client = dbClient();
    try {
        await client.query('BEGIN');
        let insertOrderQuery = `INSERT INTO supply_management.orders 
        (user_id,total_order_price,created_by) VALUES($1,$2,$3) RETURNING order_id`
        let values = [user.id, totalPrice, user.id];
        let createdOrder = await client.query(insertOrderQuery, values);
        let orderId = createdOrder.rows[0]?.order_id;
        await insertOrderDetails(client, orderId, groceries, productListExistDb, user.id, response);
        if (response.status === 'failed') {
            await client.query('ROLLBACK');
        } else {
            await client.query('COMMIT');
            response.orderId = orderId;
        }
    } catch (error) {
        console.error("Error:", error)
        await client.query('ROLLBACK');
        response.status = "failed";
        response.message = error?.message;
    }
    return response;
}

const insertOrderDetails = async (client, orderId, orderedProducts, productListExistDb, userId, response) => {

    let insertOrderDetailsValues = [];
    for (let item of orderedProducts) {
        let productInDB = productListExistDb.find(x =>
            x.product_id === item.id && x.inventories && x.inventories.find(y => y.available_quantity > item.quantity));
        if (productInDB) {
            let totalPrice = productInDB.unit_price * item.quantity;
            insertOrderDetailsValues.push([orderId, item.id, item.quantity, totalPrice, userId])
        } else {
            response.success = 'failed'
            response.message = `grocery id:${item.id} not available/out of stock`
            break;
        }
    }
    if (response.status !== 'failed') {
        let insertQuery = format(`INSERT INTO supply_management.order_details
    (order_id,product_id,product_quantity,total_price,created_by) 
     VALUES %L`, insertOrderDetailsValues);
        await client.query(insertQuery);
    }
}

const getUserOrderList = async (user) => {
    let query = `SELECT 
    ord.order_id,
    ord.total_order_price,
    CASE WHEN COUNT(ordd.order_id)> 0 THEN json_agg(
      json_build_object(
        'name', p.name, 'type', p.type,
        'quantity',  ordd.product_quantity, 
        'unit_price',   p.unit_price, 
        'unitName', p.unit_name, 
        'unitValue', p.unit_value
      )
    ) ELSE '[]' END as products 
     FROM supply_management.orders ord
    LEFT OUTER JOIN supply_management.order_details ordd on ordd.order_id = ord.order_id
    LEFT JOIN supply_management.products p on p.product_id = ordd.product_id 
    WHERE ord.user_id='${user.id}' 
    GROUP BY ord.order_id`;
    let response = await findAll(query);
    return response;
}

const getUserOrderById = async (orderId) => {
    let query = `SELECT * FROM supply_management.orders where order_id=${orderId} and user_id='${user.id}'`;
    let response = await findOne(query);
    return response;
}

module.exports = {
    createOrder, getUserOrderList, getUserOrderById
}