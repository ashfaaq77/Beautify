const Joi = require("joi");

function validateProduct(product) {
    const schema = Joi.object({
        title: Joi.string()
            .max(200)
            .required(),
        description: Joi.string()
            .max(200)
            .required(),
        sku: Joi.string()
            .max(200)
            .required(),
        regular_price: Joi.number()
            .required(),
        sale_price: Joi.number()
            .required(),
        taxable: Joi.number()
            .integer()
            .required(),
        stock: Joi.number()
            .integer()
            .required(),
        quantity: Joi.number()
            .integer()
            .required(),
        pre_orders: Joi.number()
            .integer()
            .required(),
    });
    return schema.validate(product);
}

module.exports = { validateProduct };
