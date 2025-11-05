const { verifyAccessToken } = require('../utils/jwtHelper');
const { errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../config/constants');
const { Usuario } = require('../models');

/**
 * Middleware para verificar si el usuario está autenticado
 */
const authenticate = async (req, res, next) => {
    try {
        // 1. Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(
                res,
                'No se proporcionó token de autenticación',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        const token = authHeader.split(' ')[1];

        // 2. Verificar token
        const decoded = verifyAccessToken(token);

        // 3. Buscar usuario en la BD
        const usuario = await Usuario.findByPk(decoded.id_usuario, {
            attributes: { exclude: ['password'] } // No devolver password
        });

        if (!usuario) {
            return errorResponse(
                res,
                'Usuario no encontrado',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // 4. Agregar usuario al objeto request
        req.user = {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        };

        next();
    } catch (error) {
        console.error('❌ Error en autenticación:', error.message);
        return errorResponse(
            res,
            'Token inválido o expirado',
            HTTP_STATUS.UNAUTHORIZED
        );
    }
};

/**
 * Middleware para verificar rol (después de authenticate)
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(
                res,
                'Usuario no autenticado',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        if (!roles.includes(req.user.rol)) {
            return errorResponse(
                res,
                `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`,
                HTTP_STATUS.FORBIDDEN
            );
        }

        next();
    };
};

/**
 * Middleware opcional: permite acceso con o sin autenticación
 */
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyAccessToken(token);

            const usuario = await Usuario.findByPk(decoded.id_usuario, {
                attributes: { exclude: ['password'] }
            });

            if (usuario) {
                req.user = {
                    id_usuario: usuario.id_usuario,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol
                };
            }
        }
    } catch (error) {
        // No hacer nada, continuar sin autenticación
    }

    next();
};

module.exports = {
    authenticate,
    authorize,
    optionalAuth
};