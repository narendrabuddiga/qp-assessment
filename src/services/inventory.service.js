const { dbClient, findAll, findOne, updateOne } = require('../db/pg/elephantsql');
const { getProductListByIds } = require('./product.service');
const format = require('pg-format');
const {getInventoryListQuery}=require('../sql/sqlQuery');

const getInventoryList = async () => {
    let query = getInventoryListQuery;
    let response = await findAll(query);
    return response;
}

const getInventoryById = async (id) => {
    let query = `SELECT * FROM supply_management.inventories where inventory_id=${id}`;
    let response = await findOne(query);
    return response;
}

const addInventory = async (payload, user) => {
    let response = {
        status: "success"
    };
    const { inventoryName, location } = payload;
    const client = dbClient();
    try {
        await client.query('BEGIN')
        let insertQuery = `INSERT INTO supply_management.inventories (name,location,created_by) VALUES($1,$2,$3) RETURNING inventory_id`
        let values = [inventoryName, location, user.id];
        let inventoryId = await client.query(insertQuery, values);
        await client.query('COMMIT');
        response.inventoryId = inventoryId.rows[0]?.inventory_id;
    } catch (error) {
        console.error("Error:", error)
        await client.query('ROLLBACK');
        response.status = "failed";
        response.message = error?.message;
    }
    return response;
}

const updateInventoryById = async (payload, id, user) => {
    let response = {
        status: "success"
    };
    let inventoryValuesUpdated = false
    let { location, inventoryName, groceries } = payload
    let groceryIds = groceries.map(x => x.id);
    if (groceries && groceries.length > 0 && !await isProductIdsExist(groceryIds)) {
        response.status = "failed";
        response.message = "mismatch grocery Ids"
        return response
    }
    let fields = {
    };
    if (location) {
        fields.location = location;
    }
    if (inventoryName) {
        fields.name = inventoryName;
    }

    if (Object.values(fields).filter(i => i !== null).length > 0) {
        inventoryValuesUpdated = true;
        fields = Object.assign(fields, { updated_by: user.id, updated_on: 'NOW()' })
    }
    const client = dbClient();
    try {
        let updatedInventory = '';
        await client.query('BEGIN')
        if (inventoryValuesUpdated) {
            const keys = Object.keys(fields);
            const query = `UPDATE supply_management.inventories SET ${keys
                .map((key) => `${key} = '${fields[key]}'`)
                .join(', ')} WHERE inventory_id = ${id} RETURNING inventory_id`;
            updatedInventory = await updateOne(query);
        }
        if (groceries && groceries.length > 0) {
            await addorUpdatedInventoryMapping(client, id, groceries, user.id)
            inventoryValuesUpdated = true;
        }

        await client.query('COMMIT');
        if (updatedInventory) {
            response.inventoryId = updatedInventory
            response.message = "updated inventory successfully"
        } else {
            response.status = "failed";
            response.message = "no data to update"
        }
    } catch (error) {
        console.error("Error:", error)
        await client.query('ROLLBACK');
        response.status = "failed";
        response.message = error?.message;
    }
    return response;
}

const addorUpdatedInventoryMapping = async (client, inventoryId, groceryList, userId) => {
    let insertValuesArray = [];
    for (let item of groceryList) {
        let inventoryMapping = await getInventoryMapping(inventoryId, item.id);
        if (inventoryMapping) {
            let quantity = inventoryMapping.available_quantity + item.quantity;
            let updateQuery = `UPDATE supply_management.inventory_mapping
            SET available_quantity =${quantity}, is_available =${quantity ? true : false},
               updated_by=${userId}, updated_on= NOW()
               WHERE inventory_id = ${inventoryId} and product_id=${id}`;
            await client.query(updateQuery);
        } else {
            insertValuesArray.push([inventoryId, item.id, item.quantity, item.quantity ? true : false, userId])
        }
    }

    let insertQuery = format(`INSERT INTO supply_management.inventory_mapping
     (inventory_id,product_id,available_quantity,is_available,created_by) 
     VALUES %L`, insertValuesArray);
    await client.query(insertQuery);
}

const isProductIdsExist = async (productIds) => {
    let productListExistDb = await getProductListByIds(productIds);
    return productIds.length === productListExistDb.length ? productListExistDb : null;
}

const getInventoryMapping = async (inventoryId, productId) => {
    let query = `SELECT * FROM supply_management.inventory_mapping where inventory_id=${inventoryId} and product_id=${productId}`;
    let inventoryMapping = await findOne(query);
    return inventoryMapping;
}

module.exports = {
    getInventoryList, addInventory, getInventoryById, updateInventoryById
}