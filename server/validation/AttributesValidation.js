const Joi = require("joi");

function validateAttributes(attribute) {
    const schema = Joi.object({
        name: Joi.string()
            .max(200)
            .required(),
        type: Joi.string()
            .max(200)
            .required(),
        values: Joi.string().allow('')
    });
    return schema.validate(attribute);
}


module.exports = { validateAttributes };