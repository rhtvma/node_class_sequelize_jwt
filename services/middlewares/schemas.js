/**
 * Created by rohit on 07/26/2019.
 * https://scotch.io/tutorials/node-api-schema-validation-with-joi
 */

const Joi = require('@hapi/joi');

// const schema = Joi.object()
//     .keys(
//         {
//             name: Joi.string().alphanum().min(3).max(30),
//             email: Joi.string().email({minDomainSegments: 2}).required(),
//             password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
//             role: Joi.string().alphanum().min(3).max(30),
//             access_token: [Joi.string(), Joi.number()],
//             // birthyear: Joi.number().integer().min(1900).max(2013)required(),
//         }
//     ).without('name', 'role');

// accepts name only as letters and converts to lowercase
const name = Joi.string().alphanum().min(3).max(30).lowercase();
const email = Joi.string().email({minDomainSegments: 2}).lowercase();

// accepts a valid UUID v4 string as id
const password = Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/);

// accepts ages greater than 6
// value could be in one of these forms: 15, '15', '15y', '15yr', '15yrs'
// all string ages will be replaced to strip off non-digits
const ageSchema = Joi.alternatives().try([
    Joi.number().integer().greater(6).required(),
    Joi.string().replace(/^([7-9]|[1-9]\d+)(y|yr|yrs)?$/i, '$1').required()
]);

const userDataSchema = Joi.object().keys({
    name: name.required(),
    email: email.required(),
    role: Joi.string().valid('user', 'admin').uppercase(),
    sex: Joi.string().valid(['M', 'F', 'MALE', 'FEMALE']).uppercase(),
    // if type is STUDENT, then age is required
    age: Joi.when('type', {
        is: 'user',
        then: ageSchema, //.required(),
        otherwise: ageSchema
    })
})

// password and confirmPassword must contain the same value
const authDataSchema = Joi.object({
    // id: userID.required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).required(),
    // confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict()
});


// export the schemas
module.exports = {
    '/signup': userDataSchema,
    '/signin': authDataSchema
};