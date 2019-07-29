/**
 * Created by rohit on 07/26/2019.
 * https://scotch.io/tutorials/node-api-schema-validation-with-joi
 */
const Joi = require('@hapi/joi');

const name = Joi.string().alphanum().min(3).max(30).lowercase();// accepts name only as letters and converts to lowercase
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

const signupSchema = Joi.object().keys({
    name: name.required(),
    email: email.required(),
    password: Joi.string().min(5).required(),// password and confirmPassword must contain the same value
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().strict(),
    role: Joi.string().valid('user', 'admin').uppercase(),
    sex: Joi.string().valid(['M', 'F', 'MALE', 'FEMALE']).uppercase(),
    age: Joi.when('type', {// if type is STUDENT, then age is required
        is: 'user',
        then: ageSchema, //.required(),
        otherwise: ageSchema
    })
});


const signinSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(5).required()
});

const editUserSchema = Joi.object().keys({
    name: name,
    email: email,
    role: Joi.string().valid('user', 'admin').uppercase(),
    sex: Joi.string().valid(['M', 'F', 'MALE', 'FEMALE']).uppercase(),
    age: Joi.when('type', {// if type is STUDENT, then age is required
        is: 'user',
        then: ageSchema, //.required(),
        otherwise: ageSchema
    })
});

// export the schemas
module.exports = {
    '/signup': signupSchema,
    '/signin': signinSchema,
    //users
    '/editUser': editUserSchema,
};