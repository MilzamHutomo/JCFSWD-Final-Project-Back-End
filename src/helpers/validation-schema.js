const joi = require('joi')

// Define Schema
module.exports.postUserSchema = joi.object({
    username        : joi.required(),
    email           : joi.string().email().required(),
    password        : joi.string().min(8).pattern(new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])')).required(),
    repeat_password : joi.ref('password')
})