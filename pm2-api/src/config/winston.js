const fs = require('fs');
const winston = require('winston');

// Añado a Winston este transport
require('winston-daily-rotate-file');

module.exports = function (config) {
    // Me aseguro de que existen los directorios de trabajo
    fs.mkdirSync(config.logger.logsDir, {recursive: true});

    let logLevel = config.logger.logLevelProduction;
    if (config.isDevelopment()) {
        logLevel = config.logger.logLevelDevelopment;
    }

    const myFormat = winston.format.printf(({level, message, timestamp}) => {
        if (message instanceof Object) {
            message = JSON.stringify(message);
        }
        return `[${timestamp}] [${level}] - ${message}`;
    });

    let file = new (winston.transports.DailyRotateFile)({
        dirname: config.logger.logsDir,
        filename: config.logger.errorLogFile,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: config.logger.rotateLogMaxFiles,
        level: logLevel,
        format: winston.format.combine(
            winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            winston.format.splat(),
            myFormat
        )
    });

    // Para Producción voy a loguear el nivel indicado a fichero de error
    let transportsArray = [file];
    // También las excepciones
    let exceptionsArray = [file];

    // Logueo a la consola también
    transportsArray.push(new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
            winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            winston.format.splat(),
            winston.format.colorize(),
            myFormat
        )
    }));

    // Configuro un logger llamado "logger"
    winston.loggers.add('logger', {
        transports: transportsArray,
        exceptionHandlers: exceptionsArray,
        exitOnError: false
    });

    // Capturamos los errores de winston de logueo
    winston.loggers.get('logger').on('error', function (err) {
        // Logamos al console
        console.error('Error logging with winston:');
        console.error(err);
    });

    return winston.loggers.get('logger');
};
