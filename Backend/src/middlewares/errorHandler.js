const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Middleware de manejo de errores global
 */
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error capturado:', err);

    // Error de Sequelize (base de datos)
    if (err.name === 'SequelizeValidationError') {
        return errorResponse(
            res,
            'Error de validación en la base de datos',
            HTTP_STATUS.BAD_REQUEST,
            err
        );
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        return errorResponse(
            res,
            'El registro ya existe (duplicado)',
            HTTP_STATUS.BAD_REQUEST,
            err
        );
    }

    if (err.name === 'SequelizeDatabaseError') {
        return errorResponse(
            res,
            'Error en la base de datos',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            err
        );
    }

    // Error de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return errorResponse(
            res,
            'JSON mal formado',
            HTTP_STATUS.BAD_REQUEST,
            err
        );
    }

    // Error genérico
    return errorResponse(
        res,
        err.message || ERROR_MESSAGES.INTERNAL_ERROR,
        err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
        err
    );
};

/**
 * Middleware para rutas no encontradas (404)
 */
const notFoundHandler = (req, res) => {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    errorHandler,
    notFoundHandler
};