const joi = require('joi');

// Definición del schema de validación del objeto
module.exports = joi.object()
    .keys({
        page: joi.number().min(0),
        limit: joi.number().min(5).max(50)
    });
