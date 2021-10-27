const Joi = require("joi");

function validateOrder(order) {
    const schema = Joi.object({
        status: Joi.string()
            .max(200)
            .required(),
        user: Joi.number()
            .required(),
        created_at: Joi.date()
    });
    return schema.validate(order);
}


function validateOrderUpdate(order) {
    const schema = Joi.object({
        date_created: Joi.string()
            .required(),
        hour: Joi.number()
            .required(),
        min: Joi.number()
            .required(),
        status: Joi.string()
            .max(200)
            .required(),
        customer: Joi.number()
            .required(),
        billing: Joi.object({
            address_line_1: Joi.string()
                .max(200)
                .required(),
            address_line_2: Joi.string()
                .max(200)
                .allow(''),
            city: Joi.string()
                .max(200)
                .required(),
            company: Joi.string()
                .max(200)
                .allow(''),
            country: Joi.string()
                .max(200)
                .required(),
            email: Joi.string()
                .max(200)
                .required(),
            first_name: Joi.string()
                .max(200)
                .required(),
            last_name: Joi.string()
                .max(200)
                .required(),
            phone: Joi.string()
                .max(200)
                .required(),
            post_code: Joi.string()
                .max(200)
                .required(),
            state: Joi.string()
                .max(200)
                .required(),
        }),
        shipping: Joi.object({
            address_line_1: Joi.string()
                .max(200)
                .required(),
            address_line_2: Joi.string()
                .max(200)
                .allow(''),
            city: Joi.string()
                .max(200)
                .required(),
            company: Joi.string()
                .max(200)
                .allow(''),
            country: Joi.string()
                .max(200)
                .required(),
            email: Joi.string()
                .max(200)
                .required(),
            first_name: Joi.string()
                .max(200)
                .required(),
            last_name: Joi.string()
                .max(200)
                .required(),
            phone: Joi.string()
                .max(200)
                .required(),
            post_code: Joi.string()
                .max(200)
                .required(),
            state: Joi.string()
                .max(200)
                .required(),
        })
    });
    return schema.validate(order);
}

const validateOrderNotes = (order) => {
    const schema = Joi.object({
        notes: Joi.string()
            .max(200)
            .required(),
        UserId: Joi.number()
            .required(),
        OrderId: Joi.number()
            .required()
    });
    return schema.validate(order);
}

const validateorderItems = (order) => {
    const schema = Joi.array()
        .items({
            id: Joi.number()
                .required(),
            Item: Joi.string()
                .required(),
            Sku: Joi.string()
                .required(),
            Cost: Joi.number()
                .required(),
            Qty: Joi.number()
                .required(),
            Vat: Joi.number()
                .required(),
            Total: Joi.number()
                .required(),
            attributes: Joi.object(),
            Action: Joi.string()
        })

    return schema.validate(order);
}

module.exports = { validateOrder, validateOrderUpdate, validateOrderNotes, validateorderItems };
