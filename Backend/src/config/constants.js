module.exports = {
    // Estados de eventos
    ESTADOS_EVENTO: {
        PENDIENTE: 'Pendiente',
        CONFIRMADO: 'Confirmado',
        CANCELADO: 'Cancelado',
        COMPLETADO: 'Completado'
    },

    // Roles de usuario
    ROLES_USUARIO: {
        ADMIN: 'Admin',
        CLIENTE: 'Cliente',
        EMPLEADO: 'Empleado'
    },

    // Códigos de respuesta HTTP
    HTTP_STATUS: {
        OK: 200,
        CREATED: 201,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500
    },

    // Mensajes de error comunes
    ERROR_MESSAGES: {
        NOT_FOUND: 'Recurso no encontrado',
        VALIDATION_ERROR: 'Error de validación',
        UNAUTHORIZED: 'No autorizado',
        INTERNAL_ERROR: 'Error interno del servidor',
        MISSING_FIELDS: 'Faltan campos obligatorios'
    }
};