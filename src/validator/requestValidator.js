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

module.exports = {
    loginRequestValidate,registerRequestValidate
}