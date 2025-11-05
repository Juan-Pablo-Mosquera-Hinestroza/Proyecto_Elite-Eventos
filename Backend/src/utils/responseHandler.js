/**
 * Respuesta exitosa estándar
 */
const successResponse = (res, data, message = 'Operación exitosa', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

/**
 * Respuesta de error estándar
 */
const errorResponse = (res, message = 'Error en la operación', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString()
    };

    // Solo incluir detalles del error en desarrollo
    if (process.env.NODE_ENV === 'development' && error) {
        response.error = error.message;
        response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
};

/**
 * Respuesta de validación
 */
const validationErrorResponse = (res, errors) => {
    return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors,
        timestamp: new Date().toISOString()
    });
};

/**
 * Respuesta de recurso no encontrado
 */
const notFoundResponse = (res, resource = 'Recurso') => {
    return res.status(404).json({
        success: false,
        message: `${resource} no encontrado`,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse,
    notFoundResponse
};