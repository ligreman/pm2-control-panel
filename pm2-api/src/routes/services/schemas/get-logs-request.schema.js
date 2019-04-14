const joi = require('joi');

// Definición del schema de validación del objeto
module.exports = joi.object()
    .keys({
        id: joi.number().min(0).required(),
        type: joi.valid(['out', 'error'])
    });
