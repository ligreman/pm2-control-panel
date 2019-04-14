const joi = require('joi');

// Definición del schema de validación del objeto
module.exports = joi.object()
    .keys({
        script: joi.string().min(1).required(),
        name: joi.string().regex(/^[ _\-0-9a-zA-ZÀ-ÿ\u00f1\u00d1]+$/, 'alphanumeric + spaces').min(3).max(50).required(),
        instances: joi.number().min(1).required()
    });
