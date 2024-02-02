import winston from "winston";
import __dirname from "../utils.js";
import environmentConfig from '../enviroments.js'

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http:4,
        debug: 5
    }
}

let logger 

if (environmentConfig.NODE_ENV === 'staging') {
    // Configuración para el entorno de staging (registra desde 'debug' hacia arriba)
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.simple()
            }),
            new winston.transports.File({ filename: __dirname + '/errors.log', level: 'debug' })
        ]
    });
} else {
    // Configuración por defecto para otros entornos (registra desde 'info' hacia arriba)
    logger = winston.createLogger({
        levels: customLevelOptions.levels,
        transports: [
            new winston.transports.Console({
                level: 'info',
                format: winston.format.simple()
            }),
            new winston.transports.File({ filename: __dirname + '/errors.log', level: 'info' })
        ]
    });
}

export default logger;

export const addLogger = (req,res, next) =>{
    req.logger = logger
    req.logger.debug(`[${req.method}] ${req.url} - ${new Date()}`)
    next()
}

// export const logger = winston.createLogger({
//     levels: customLevelOptions.levels,
//     transports: [
//         new winston.transports.Console({
//             level: 'http',
//             format: winston.format.simple()
//         }),
//         new winston.transports.File ({filename: __dirname + '/errors.log', level: 'debug'})
//     ]
// })






// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({level: 'http'}),
//         new winston.transports.File ({filename: '/errors.log', level: 'warn'})

//     ]
// })

