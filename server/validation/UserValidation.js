const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

function validateRegisterUser(user) {
    const schema = Joi.object({
        first_name: Joi.string()
            .max(200)
            .required(),
        last_name: Joi.string()
            .max(200)
            .required(),
        email: Joi.string()
            .email()
            .max(50)
            .required(),
        password: new PasswordComplexity({
            min: 8,
            max: 25,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4
        }),
        passwordVerify: new PasswordComplexity({
            min: 8,
            max: 25,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4
        })
    });
    return schema.validate(user);
}

function validateDetailsUser(user) {
    const schema = Joi.object({
        first_name: Joi.string()
            .max(200)
            .required(),
        last_name: Joi.string()
            .max(200)
            .required(),
        email: Joi.string()
            .email()
            .max(50)
            .required(),
    });
    return schema.validate(user);
}

function validatePasswordUser(user) {
    const schema = Joi.object({
        password: new PasswordComplexity({
            min: 8,
            max: 25,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4
        }),
        passwordVerify: new PasswordComplexity({
            min: 8,
            max: 25,
            lowerCase: 1,
            upperCase: 1,
            numeric: 1,
            symbol: 1,
            requirementCount: 4
        })
    });
    return schema.validate(user);
}

function validateDetailsRoleUser(user) {
    const schema = Joi.object({
        role: Joi.string()
            .allow('customer', 'administrator')
            .required(),
        userid: Joi.number()
            .integer()
            .required(),
    });
    return schema.validate(user);
}

module.exports = { validateRegisterUser, validateDetailsUser, validatePasswordUser, validateDetailsRoleUser };