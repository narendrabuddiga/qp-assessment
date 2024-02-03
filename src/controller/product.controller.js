const productService = require('../services/product.service');
const { responseHandler } = require('../helper/helper');

const getProductList = async (req, res) => {
    let prodcutList = await productService.getProductList();
    res.status(200).send(responseHandler(prodcutList));
}

const getProductById = async (req, res) => {
    let prodcutDetails = await productService.getProductById(req.params.id);
    if (prodcutDetails) {
        res.status(200).send(responseHandler(prodcutDetails));
    } else {
        res.status(404).send("Grocery not found");
    }
}

const removeProductById = async (req, res) => {
    let prodcutDetails = await productService.removeProductById(req.params.id);
    if (prodcutDetails) {
        res.status(200).send(responseHandler(prodcutDetails));
    } else {
        res.status(404).send("Grocery not found");
    }
}

const addProduct = async (req, res) => {
    let response = await productService.addProduct(req.body, req.user);
    if (response.status === 'success') {
        res.status(200).send(response);
    } else {
        res.status(500).send(response);
    }
}

module.exports = {
    getProductList, addProduct, getProductById,removeProductById
}