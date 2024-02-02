const { dbClient, findAll, findOne, updateOne } = require('../db/pg/elephantsql');
const { pgFormatDate } = require('../helper/helper');


const getInventoryList = async () => {
    let query = `SELECT * FROM supply_management.inventories`;
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
    let { location, inventoryName, groceryIds } = payload
    let fields = {
        updated_by: user.id,
        updated_on: pgFormatDate()
    };
    if (location) {
        fields.location = location;
    }
    if (inventoryName) {
        fields.name = inventoryName;
    }

    const keys = Object.keys(fields);
    const query = `UPDATE supply_management.inventories SET ${keys
        .map((key) => `${key} = '${fields[key]}'`)
        .join(', ')} WHERE inventory_id = ${id} RETURNING inventory_id`;
    let response = await updateOne(query);
    return response;

}

module.exports = {
    getInventoryList, addInventory, getInventoryById, updateInventoryById
}