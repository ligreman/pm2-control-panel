// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
const pm2 = require('pm2');
const os = require('os');
const utils = require('../../common/utils/utils');
const MESSAGES = require('../../config/messages');
const logger = require('winston').loggers.get('logger');
const CONFIG = require('../../config/config');

/**
 * Arrancar un servicio nuevo
 * Si se indica el mismo servicio que ya está arrancado, lo reinicia
 * @param [body] name: nombre del servicio, script: script a arrancar
 */
router.post('/start', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.body));

    // Lista de scripts disponibles
    let scriptList = utils.getAvailableScripts();

    // Verifico que viene el parámetro obligatorio
    if (!req.body.script || !scriptList.includes(req.body.script)) {
        res.status(400).json({'error_message': MESSAGES.errors.wrongParams});
        return;
    }

    // Parámetros opcionales
    let name = utils.generateName(req.body.script);
    if (req.body.name && req.body.name !== '') {
        name = req.body.name;
    }
    let instances = 1;
    if (req.body.instances && !isNaN(req.body.instances)) {
        instances = parseInt(req.body.instances);
    }

    // Si todo es correcto, arranco el script
    pm2.start({
        script: req.body.script,
        name: name,
        cwd: CONFIG.scriptFolder,
        instances: instances,
        output: '/var/log/pm2.' + name.toLowerCase().replace(/ /g, '') + '.out.log',
        error: '/var/log/pm2.' + name.toLowerCase().replace(/ /g, '') + '.error.log',
        merge_logs: true
    }, (err, createdApp) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2StartError});
        } else {
            logger.info('PM2 started');
            res.json({
                'data': createdApp
            });

        }
    });
});

/**
 * Lista de servicios arrancados en PM2
 */
router.get('/', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.query));

    let page = 0;
    if (req.query.page && !isNaN(req.query.page)) {
        page = parseInt(req.query.page);
    }

    let limit = 5;
    if (req.query.limit && !isNaN(req.query.limit)) {
        limit = parseInt(req.query.limit);
    }

    // Para el total
    let total = 0;

    pm2.list((err, processList) => {
        // Genero el objeto a devolver
        let returnList = [];
        processList.forEach(function (process) {
            // Calculo el tiempo levantado
            let uptime = process.pm2_env.pm_uptime;

            returnList.push({
                id: process.pm_id,
                name: process.name,
                script: process.pm2_env.pm_exec_path,
                memory: process.monit.memory / 1024 / 1024,
                cpu: process.monit.cpu,
                mode: process.pm2_env.exec_mode.replace('_mode', ''),
                status: process.pm2_env.status,
                restarted: process.pm2_env.restart_time,
                time: uptime
            });
        });

        total = returnList.length;

        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2ListProcessesError});
        } else {
            let skip = page * limit;

            logger.info('PM2 list result');

            // Devuelvo desde el elemento skip hasta el skip más el limit
            res.json({
                'data': {
                    'processes': returnList.slice(skip, skip + limit),
                    'total': total
                }
            });

        }
    });
});

/**
 * Lista de servicios availables
 */
router.get('/available', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.query));

    let filesInFolder = utils.getAvailableScripts();

    res.json({
        'data': filesInFolder
    });
});

/**
 * Parar un servicio
 * @param [body] id: pm id del servicio
 */
router.post('/stop', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.body));

    // Parámetros opcionales
    if (!utils.validateId(req.body.id)) {
        res.status(400).json({'error_message': MESSAGES.errors.wrongParams});
        return;
    }

    pm2.stop(req.body.id, (err, proc) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2StopError});
        } else {
            logger.info('PM2 stopped');
            res.json({
                'message': MESSAGES.pm2ServiceStopped
            });

        }
    });
});

/**
 * Eliminar un servicio
 * @param [body] id: nombre del servicio
 */
router.post('/delete', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.body));

    // Parámetros opcionales
    if (!utils.validateId(req.body.id)) {
        res.status(400).json({'error_message': MESSAGES.errors.wrongParams});
        return;
    }

    pm2.delete(req.body.id, (err, proc) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2DeleteError});
        } else {
            logger.info('PM2 deleted');
            res.json({
                'message': MESSAGES.pm2ServiceDeleted
            });

        }
    });
});

/**
 * Reiniciar (start & stop) un servicio
 * @param [body] id: nombre del servicio
 */
router.post('/restart', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.body));

    // Parámetros opcionales
    if (!utils.validateId(req.body.id)) {
        res.status(400).json({'error_message': MESSAGES.errors.wrongParams});
        return;
    }

    pm2.restart(req.body.id, (err, proc) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2RestartError});
        } else {
            logger.info('PM2 restarted');
            res.json({
                'message': MESSAGES.pm2ServiceRestarted
            });

        }
    });
});

/**
 * Recargar un servicio (carga cambios en js)
 * @param [body] id: nombre del servicio
 */
router.post('/reload', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.body));

    // Parámetros opcionales
    if (!utils.validateId(req.body.id)) {
        res.status(400).json({'error_message': MESSAGES.errors.wrongParams});
        return;
    }

    pm2.reload(req.body.id, (err, proc) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2ReloadError});
        } else {
            logger.info('PM2 reloaded');
            res.json({
                'message': MESSAGES.pm2ServiceReloaded
            });

        }
    });
});

/**
 * Obtiene los logs de un servicio
 * @param [query] id: nombre del servicio
 * @param [query] type: tipo de log 'out' 'error'
 */
router.get('/log', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.query));

    // Parámetros opcionales
    if (!utils.validateId(req.query.id)) {
        res.status(400).json({'error_message': MESSAGES.errors.wrongParams});
        return;
    }

    let logFileName = 'out';
    if (req.query.type && req.query.type === 'error') {
        logFileName = 'error';
    }

    pm2.describe(req.query.id, (err, proc) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2LogError});
        } else {
            logger.info('PM2 describe process ' + req.query.id);

            // Saco las rutas de los logs
            let file = '';

            if (logFileName === 'error') {
                file = proc[0].pm2_env.pm_err_log_path;
            } else {
                file = proc[0].pm2_env.pm_out_log_path;
            }

            // Si existe el fichero de log out
            res.download(file, logFileName + '.log');
        }
    });
});

/**
 * Obtiene los datos del OS
 */
router.get('/api/machine', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));

    var cpus = os.cpus(),
        freemem = os.freemem(),
        mem = os.totalmem(),
        so = os.type(),
        release = os.release();

    // Cojo la info de cada cpu
    var rescpus = [];
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

// Status
router.get('/', function (req, res) {
    res.json({
        'data': {
            'status': 'OK'
        }
    });
});

// Default
router.get('*', function (req, res) {
    res.status(404).json({
        'error_message': MESSAGES.notFound
    });
});

module.exports = router;

