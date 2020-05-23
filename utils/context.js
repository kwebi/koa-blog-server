const Joi = require("@hapi/joi")

function validate(params = {}, schama = {}) {
    const validator =  Joi.object(schama).validate(params,{ allowUnknown: true })
    if (validator.error) {
        return false
    }
    return true
}

module.exports = {
    validate: validate
}
