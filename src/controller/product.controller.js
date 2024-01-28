const productService = require('../services/product.service');

const getProductList = async (req, res) => {
    let prodcutList = await productService.getProductList();
    res.status(200).send(prodcutList);
}

module.exports = {
    getProductList
}