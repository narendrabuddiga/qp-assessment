const inventoryService = require('../services/inventory.service');

const getInventoryList = async (req, res) => {
    let inventoryList = await inventoryService.getInventoryList();
    res.status(200).send(inventoryList);
}

const addInventory = async (req, res) => {
    let inventoryList = await inventoryService.getInventoryList();
    res.status(200).send(inventoryList);
}

const updateInventory = async (req, res) => {
    let inventoryList = await inventoryService.getInventoryList();
    res.status(200).send(inventoryList);
}

module.exports = {
    getInventoryList, addInventory, updateInventory
}