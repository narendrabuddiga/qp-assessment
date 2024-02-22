const orderService = require('../services/order.service');
const { responseHandler } = require('../helper/helper');
const redisClient = require('../db/redis/redis');

const createOrder = async (req, res) => {
    let response = await orderService.createOrder(req.body, req.user);
    if (response.status === 'success') {
        res.status(200).send(response);
    } else {
        res.status(500).send(response);
    }
}

const getUserOrderList = async (req, res) => {
    let response;
    let key = `${req.user.id}_order_list`;
    const cacheResults = await redisClient.getValue(key);
    if (cacheResults) {
        response = JSON.parse(cacheResults);
    } else {
        let data = await orderService.getUserOrderList(req.user);
        redisClient.setValue(key, JSON.stringify(data));
        response = data;
    }
    res.status(200).send(response);
}

const getUserOrderById = async (req, res) => {
    let key = `${req.user.id}_order_${req.params.id}`;
    const cacheResults = await redisClient.getValue(key);
    if (cacheResults) {
        response = JSON.parse(cacheResults);
    } else {
        let data = await orderService.getUserOrderById(req.params.id, req.user);
        redisClient.setValue(key, JSON.stringify(data));
        response = data;
    }
    res.status(200).send(response);
}

const removeUserOrderById = async (req, res) => {
    let response = await orderService.removeOrderById(req.params.id, req.user);
    res.status(200).send(response);
}

module.exports = {
    createOrder, getUserOrderList, getUserOrderById, removeUserOrderById
}