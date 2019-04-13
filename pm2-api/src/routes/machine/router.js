// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
const os = require('os');
const logger = require('winston').loggers.get('logger');

/**
 * Obtiene los datos del OS
 */
router.get('/', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));

    let cpus = os.cpus(),
        freemem = os.freemem(),
        mem = os.totalmem(),
        so = os.type(),
        release = os.release();

    // Cojo la info de cada cpu
    let rescpus = [];
    cpus.forEach(function (cpu) {
        rescpus.push({
            model: cpu.model,
            speed: cpu.speed
        });
    });

    // Memoria
    freemem = Math.round((freemem / 1024) / 1024);
    mem = Math.round((mem / 1024) / 1024);

    res.json({
        'data': {
            'os': so + ' ' + release,
            'cpus': rescpus,
            'freememory': freemem + 'MB / ' + mem + 'MB'
        }
    });
});

module.exports = router;

