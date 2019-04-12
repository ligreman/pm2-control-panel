/***** Argumentos de ejecución *****/
// Miro a ver si por argumentos me indican que estoy en modo test
process.argv.forEach((val) => {
    if (val === '--test') {
        global.testModeExecution = true;
    }
});

/*************************/
/***** Importaciones *****/
/*************************/
// Módulos de terceros
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const morgan = require('morgan');
const pm2 = require('pm2');

// Configuración
const config = require('./config/config');
// Creo un logger winston
const logger = require('./config/winston')(config);
// Módulo de errores de API
const errors = require('./common/errors/api-errors');
// Configuración de log de HTTP Morgan
const configMorgan = require('./config/morgan')(config);

/***** Genero la applicación con Express *****/
let app = express();

configureExpressApp();

/**
 * Configuramos la aplicación Express que levanta el API
 */
function configureExpressApp() {

    /***** Middlewares *****/
    // Helmet para temas de seguridad
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(helmet.referrerPolicy({policy: 'same-origin'}));

    // Parseador del body de las respuestas
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    // Prevención de HTTP Pullution. Colocarlo después de haber parseado el body
    app.use(hpp({}));

    // Morgan para loguear las peticiones al API (requests)
    if (config.isDevelopment()) {
        // Log completo a consola
        app.use(morgan(config.logger.morganFormatDevelopment));
    }
    // Logueo a fichero
    app.use(morgan(config.logger.morganFormatProduction, {stream: configMorgan.accessLogStream}));

    // Montamos las rutas en el raíz
    // Módulo de Router principal
    const router = require('./routes/index');
    app.use('/api', router);

    // Si la petición no ha sido atendida por ningún endpoint anterior, es un 404
    app.use(function (req, res, next) {
        // Muestro un html de error
        let file = require('./common/errors/404.html');
        res.set('Content-Type', 'text/html')
            .send(file);
    });

    // Por último, manejamos los errores genéricos del API
    app.use(errors.logApiErrors);
    app.use(errors.apiErrorHandler);

    // Ahora ya arranco el servidor
    pm2Connect();
}

/**
 * Conectamos al api de PM2
 */
function pm2Connect() {
    pm2.connect(function (err) {
        // Si hay error salgo
        if (err) {
            logger.error(err);
            throw new Error('Cannot connect to PM2 API');
        }

        // Inicio el api
        startServer();
    });
}

/**
 * Arranca el servidor
 */
function startServer() {
    /*************************/
    /** Levanto el servidor **/
    /*************************/
    let server = app.listen(config.server.port, () => {
        logger.info('Server started and listening in %s. Environment=%s', config.server.port, config.environment);

        // Handler de excepciones no gestionadas
        require('./common/errors/exceptions')({apiServer: server});

        // Si estoy en tests guardo la variable del servidor
        if (global.testModeExecution) {
            app.set('listeningServer', server);
        }
    });
}

module.exports = app;
