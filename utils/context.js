const Joi = require("joi")

function validate(params = {}, schama = {}) {
    const ctx = this
    const validator = Joi.validate(params, Joi.object(schama), {
        allowUnknown: true
    })
    if (validate.error) {
        ctx.throw(400, validator.error.message)
        return false
    }
    return true
}

module.exports = {
    validate: validate
}