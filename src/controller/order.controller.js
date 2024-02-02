const orderService = require('../services/order.service');
const { responseHandler } = require('../helper/helper');

const createOrder = async (req, res) => {
    let response = await orderService.createOrder(req.body, req.user);
    res.status(200).send("createOrder");
}

const getOrderList = async (req, res) => {
    let response = await orderService.getOrderList();
    res.status(200).send(response);
}

module.exports = {
    createOrder, getOrderList
}