const inventoryService = require('../services/inventory.service');
const { responseHandler } = require('../helper/helper');

const getInventoryList = async (req, res) => {
    let inventoryList = await inventoryService.getInventoryList();
    res.status(200).send(responseHandler(inventoryList));
}

const getInventoryById = async (req, res) => {
    let inventoryDetails = await inventoryService.getInventoryById(req.params.id);
    if (inventoryDetails) {
        res.status(200).send(responseHandler(inventoryDetails));
    } else {
        res.status(404).send("Inventory not found");
    }
}

const addInventory = async (req, res) => {
    let response = await inventoryService.addInventory(req.body, req.user);
    if (response.status === 'success') {
        res.status(200).send(response);
    } else {
        res.status(500).send(response);
    }
}

const updateInventory = async (req, res) => {
    let inventoryExistsInDb = await inventoryService.getInventoryById(req.params.id);
    if (inventoryExistsInDb) {
        let updatedInventoryRes = await inventoryService.updateInventoryById(req.body, req.params.id, req.user);
        if (updatedInventoryRes.status === 'success') {
            res.status(200).send(updatedInventoryRes);
        } else {
            res.status(500).send(updatedInventoryRes);
        }
    } else {
        res.status(404).send("Inventory not found");
    }
}

module.exports = {
    getInventoryList, addInventory, updateInventory, getInventoryById
}