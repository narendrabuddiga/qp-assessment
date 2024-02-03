const { dbClient, findAll, findOne } = require('../db/pg/elephantsql');


const getProductList = async () => {
    let query = `SELECT 
    p.product_id, 
    p.name, 
    p.type, 
    p.unit_name, 
    p.unit_value, 
    p.unit_price, 
    CASE WHEN COUNT(invmap.inventory_id)> 0 THEN json_agg(
      json_build_object(
        'inventory_id',inv.inventory_id,
        'inventory_name', inv.name, 'inventory_location', 
        inv.location, 'is_available', invmap.is_available, 
        'availableQuantity', invmap.available_quantity
      )
    ) ELSE '[]' END as inventories 
  FROM 
    supply_management.products p 
    LEFT OUTER JOIN supply_management.inventory_mapping invmap on invmap.product_id = p.product_id 
    LEFT OUTER JOIN supply_management.inventories inv on inv.inventory_id = invmap.inventory_id 
  GROUP BY 
    p.product_id `;
    let response = await findAll(query);
    return response;
}

const getProductQuantityListByIds = async (ids) => {
    let query = `SELECT 
    p.product_id, 
    p.name, 
    p.type, 
    p.unit_name, 
    p.unit_value, 
    p.unit_price, 
    CASE WHEN COUNT(invmap.inventory_id)> 0 THEN json_agg(
      json_build_object(
        'inventory_id',inv.inventory_id,
        'inventory_name', inv.name, 'inventory_location', 
        inv.location, 'is_available', invmap.is_available, 
        'available_quantity', invmap.available_quantity
      )
    ) ELSE '[]' END as inventories 
  FROM 
    supply_management.products p 
    LEFT OUTER JOIN supply_management.inventory_mapping invmap on invmap.product_id = p.product_id 
    LEFT OUTER JOIN supply_management.inventories inv on inv.inventory_id = invmap.inventory_id 
    WHERE p.product_id in (${ids.toString()})
  GROUP BY 
    p.product_id`;
    let productList = await findAll(query);
    return productList;
}

const getProductById = async (id) => {
    let query = `SELECT * FROM supply_management.products where product_id=${id}`;
    let response = await findOne(query);
    return response;
}

const getProductListByIds = async (ids) => {
    let query = `SELECT * FROM supply_management.products where product_id in (${ids.toString()})`;
    let productList = await findAll(query);
    return productList;
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
    getProductList, addProduct, getProductById, getProductListByIds,getProductQuantityListByIds
}