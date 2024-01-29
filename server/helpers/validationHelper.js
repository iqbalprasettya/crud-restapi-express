const Joi = require("joi");
const Boom = require('boom');

const userListValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().optional().description('User username; i.e. Bulbasaur'),
        password: Joi.string().optional().description('User password; i.e. querty123'),
        fullName: Joi.string().optional().description('User fullName; i.e. John Doe'),

    });
    if (schema.validate(data).error) {
        throw Boom.badRequest(schema.validate(data).error);
    }
};

module.exports = {
    userListValidation
};

