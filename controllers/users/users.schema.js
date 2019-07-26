/**
 * Created by rohit on 07/26/2019.
 */

const Joi = require('@hapi/joi');

const schema = Joi.object()
    .keys(
        {
            name: Joi.string().alphanum().min(3).max(30).required(),
            role: Joi.string().alphanum().min(3).max(30).required(),
            password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
            birthyear: Joi.number().integer().min(1900).max(2013),
            email: Joi.string().email({minDomainSegments: 2})
        }
    )
    .with('username', 'birthyear')
    .without('password', 'access_token');

const validate = (obj) => {
    return Joi.validate(obj, schema);
}

module.exports = {
    validate: validate
}

