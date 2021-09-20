const Joi = require("joi");

function validateCategories(category) {
    const schema = Joi.object({
        name: Joi.string()
            .max(200)
            .required(),
        parent: Joi.number()
            .integer()
            .required()
    });
    return schema.validate(category);
}


module.exports = { validateCategories };