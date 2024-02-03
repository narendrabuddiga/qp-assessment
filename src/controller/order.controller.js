const orderService = require('../services/order.service');
const { responseHandler } = require('../helper/helper');

const createOrder = async (req, res) => {
    let response = await orderService.createOrder(req.body, req.user);
    if (response.status === 'success') {
        res.status(200).send(response);
    } else {
        res.status(500).send(response);
    }
}

const getUserOrderList = async (req, res) => {
    let response = await orderService.getUserOrderList(req.user);
    res.status(200).send(response);
}

const getUserOrderById = async (req, res) => {
    let response = await orderService.getUserOrderById(req.params.id,req.user);
    res.status(200).send(response);
}

module.exports = {
    createOrder, getUserOrderList, getUserOrderById
}