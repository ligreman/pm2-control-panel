// Creamos un Router para definir las rutas en su propio módulo
const Router = require('express').Router;
const router = new Router();
const pm2 = require('pm2');
const utils = require('../../common/utils/utils');
const MESSAGES = require('../../config/messages');
const logger = require('winston').loggers.get('logger');
const scriptsAvailableJson = require('../../config/available-scripts');
const joi = require('joi');

const schemas = require('./schemas');

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

    // Validación de parámetros
    const {error, value} = joi.validate(req.body, schemas.startServiceRequest);

    // Verifico que vienen los parámetros obligatorios
    if (error || !scriptList.includes(value.script)) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    // Saco el JSON del script correspondiente
    let options = null;
    scriptsAvailableJson.apps.forEach((app) => {
        if (app.label === value.script) {
            options = app;
        }
    });

    // Si no encuentro el script es que algo ha ido mal
    if (options === null) {
        return res.status(500).json({'error_message': MESSAGES.errors.pm2ScriptNotFound});
    }

    // Nombre del proceso
    let name = utils.generateName(options.label);
    if (value.name && value.name !== '') {
        name = value.name;
    }
    // Instancias a crear
    let instances = 1;
    if (value.instances && !isNaN(value.instances)) {
        instances = parseInt(value.instances);
    }

    // Completo el objeto de opciones
    options.name = name;
    options.output = options.output.replace('<name>', name.toLowerCase().replace(/ /g, ''));
    options.error = options.error.replace('<name>', name.toLowerCase().replace(/ /g, ''));
    options.instances = instances;
    delete options.label;

    // Si todo es correcto, arranco el script
    pm2.start(options, (err, createdApp) => {
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

    // Validación de parámetros
    const {error, value} = joi.validate(req.query, schemas.getServicesRequest);

    // Verifico que vienen los parámetros obligatorios
    if (error) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    let page = 0;
    if (value.page) {
        page = parseInt(value.page);
    }

    let limit = 5;
    if (value.limit) {
        limit = parseInt(value.limit);
    }

    // Para el total
    let total = 0;

    pm2.list((err, processList) => {
        // Genero el objeto a devolver
        let returnList = [];
        processList.forEach(function (process) {
            // Calculo el tiempo levantado
            let uptime = new Date().getTime() - process.pm2_env.pm_uptime;

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

    // Validación de parámetros
    const {error, value} = joi.validate(req.body, schemas.bodyIdParam);

    // Verifico que vienen los parámetros obligatorios
    if (error) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    pm2.stop(value.id, (err) => {
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
 * Flushea un servicio (elimina los logs)
 * @param [body] name: el name del proceso
 */
router.post('/flush', function (req, res) {
    logger.info('Peticion: ' + JSON.stringify(req.route));
    logger.info('    params: ' + JSON.stringify(req.body));

    // Validación de parámetros
    const {error, value} = joi.validate(req.body, schemas.bodyNameParam);

    // Verifico que vienen los parámetros obligatorios
    if (error) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    pm2.flush(value.name, (err) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2FlushError});
        } else {
            logger.info('PM2 flushed');
            res.json({
                'message': MESSAGES.pm2ServiceFlushed
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

    // Validación de parámetros
    const {error, value} = joi.validate(req.body, schemas.bodyIdParam);

    // Verifico que vienen los parámetros obligatorios
    if (error) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    pm2.delete(value.id, (err) => {
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

    // Validación de parámetros
    const {error, value} = joi.validate(req.body, schemas.bodyIdParam);

    // Verifico que vienen los parámetros obligatorios
    if (error) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    pm2.restart(value.id, (err) => {
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

    // Validación de parámetros
    const {error, value} = joi.validate(req.body, schemas.bodyIdParam);

    // Verifico que vienen los parámetros obligatorios
    if (error) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    pm2.reload(value.id, (err) => {
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

    // Validación de parámetros
    const {error, value} = joi.validate(req.body, schemas.getLogsRequest);

    // Verifico que vienen los parámetros obligatorios
    if (error) {
        return res.status(400).json({'error_message': utils.createJoiErrorMessage(error)});
    }

    let logFileName = 'out';
    if (value.type === 'error') {
        logFileName = 'error';
    }

    pm2.describe(value.id, (err, proc) => {
        if (err) {
            logger.error(err);
            res.status(400).json({'error_message': MESSAGES.errors.pm2LogError});
        } else {
            logger.info('PM2 describe process ' + value.id);

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

module.exports = router;

