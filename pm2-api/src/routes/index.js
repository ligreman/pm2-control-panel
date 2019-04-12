// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();

// Importamos los ficheros de rutas
const serviceRouter = require('./services/router');

// Monto los otros endpoints
router.use('/services', serviceRouter);

// Endpoint base
router.get('/', function (req, res, next) {
    let error = false;
    // Supongamos que hay un error
    if (error) {
        // Paso el error a Express para que lo gestione (va al siguiente middleware)
        next('err variable');
    } else {
        // Respondemos normalmente
        res.status(200).send('OK');
    }
});

module.exports = router;

