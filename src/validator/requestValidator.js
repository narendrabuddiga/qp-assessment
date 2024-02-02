const Joi = require('@hapi/joi');


const loginRequestValidate = (req, res, next) => {
    const loginSchema = Joi.object({
        username: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required()
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};


const registerRequestValidate = (req, res, next) => {
    const registerSchema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        password: Joi.string().min(6).max(30).required(),
        email: Joi.string().email().required(),
        gender: Joi.string().optional(),
        location: Joi.string().optional(),
        mobileNo: Joi.number().optional(),
    });

    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const createInventory = (req, res, next) => {
    const inventorySchema = Joi.object({
        inventoryName: Joi.string().required(),
        location: Joi.string().required(),
        grocreies: Joi.array().optional().items(Joi.number().required())
    });

    const { error } = inventorySchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const validateIdField = (req, res, next) => {
    const idSchema = Joi.object({
        id: Joi.number().required(),
    });
    const { error } = idSchema.validate(req.params);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    next();
};

const updateInventoryValidate = (req, res, next) => {
    const idSchema = Joi.object({
        id: Joi.number().required(),
    });
    const { idError } = idSchema.validate(req.params);
    if (idError) {
        return res.status(400).send(idError.details[0].message);
    }

    const updateInventorySchema = Joi.object({
        inventoryName: Joi.string().required(),
        location: Joi.string().required(),
        groceryIds: Joi.array().required()
    }).or('inventoryName', 'location', 'groceryIds');

    const { error } = updateInventorySchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

const addProductReqValidate = (req, res, next) => {
    const addProductSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        type: Joi.string().required(),
        unitName: Joi.string().required(),
        unitValue: Joi.number().required(),
        unitPrice: Joi.number().required(),
        currency:Joi.string().required()
    });

    const { error } = addProductSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    next();
};

module.exports = {
    loginRequestValidate,
    registerRequestValidate,
    validateIdField,
    createInventory,
    updateInventoryValidate,
    addProductReqValidate
}