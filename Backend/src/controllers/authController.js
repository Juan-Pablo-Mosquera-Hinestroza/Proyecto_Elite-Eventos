const { Usuario } = require('../models');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwtHelper');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../config/constants');

// ================================
// POST - Registro de usuario
// ================================
const register = async (req, res) => {
    try {
        const { nombre, email, password, telefono, direccion } = req.body;

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ where: { email } });

        if (usuarioExistente) {
            return errorResponse(
                res,
                'El email ya está registrado',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Crear usuario (el hook beforeCreate hasheará la contraseña)
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password,
            telefono,
            direccion,
            rol: 'Cliente' // Por defecto es Cliente
        });

        // Generar tokens
        const accessToken = generateAccessToken({
            id_usuario: nuevoUsuario.id_usuario,
            email: nuevoUsuario.email,
            rol: nuevoUsuario.rol
        });

        const refreshToken = generateRefreshToken({
            id_usuario: nuevoUsuario.id_usuario
        });

        return successResponse(
            res,
            {
                usuario: {
                    id_usuario: nuevoUsuario.id_usuario,
                    nombre: nuevoUsuario.nombre,
                    email: nuevoUsuario.email,
                    telefono: nuevoUsuario.telefono,
                    direccion: nuevoUsuario.direccion,
                    rol: nuevoUsuario.rol
                },
                accessToken,
                refreshToken
            },
            '✅ Usuario registrado exitosamente',
            HTTP_STATUS.CREATED
        );

    } catch (error) {
        console.error('❌ Error en registro:', error);
        return errorResponse(
            res,
            'Error al registrar usuario',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error
        );
    }
};

// ================================
// POST - Login de usuario
// ================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email (incluir password)
        const usuario = await Usuario.findOne({
            where: { email },
            attributes: { include: ['password'] }
        });

        if (!usuario) {
            return errorResponse(
                res,
                'Credenciales inválidas',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Verificar contraseña
        const passwordValido = await usuario.comparePassword(password);

        if (!passwordValido) {
            return errorResponse(
                res,
                'Credenciales inválidas',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Generar tokens
        const accessToken = generateAccessToken({
            id_usuario: usuario.id_usuario,
            email: usuario.email,
            rol: usuario.rol
        });

        const refreshToken = generateRefreshToken({
            id_usuario: usuario.id_usuario
        });

        return successResponse(
            res,
            {
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    telefono: usuario.telefono,
                    direccion: usuario.direccion,
                    rol: usuario.rol
                },
                accessToken,
                refreshToken
            },
            '✅ Login exitoso'
        );

    } catch (error) {
        console.error('❌ Error en login:', error);
        return errorResponse(
            res,
            'Error al iniciar sesión',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error
        );
    }
};

// ================================
// POST - Refresh token
// ================================
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(
                res,
                'Refresh token no proporcionado',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // Verificar refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Buscar usuario
        const usuario = await Usuario.findByPk(decoded.id_usuario);

        if (!usuario) {
            return errorResponse(
                res,
                'Usuario no encontrado',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Generar nuevo access token
        const newAccessToken = generateAccessToken({
            id_usuario: usuario.id_usuario,
            email: usuario.email,
            rol: usuario.rol
        });

        return successResponse(
            res,
            {
                accessToken: newAccessToken
            },
            'Token renovado exitosamente'
        );

    } catch (error) {
        console.error('❌ Error al renovar token:', error);
        return errorResponse(
            res,
            'Refresh token inválido o expirado',
            HTTP_STATUS.UNAUTHORIZED
        );
    }
};

// ================================
// GET - Obtener perfil del usuario autenticado
// ================================
const getProfile = async (req, res) => {
    try {
        // req.user viene del middleware authenticate
        const usuario = await Usuario.findByPk(req.user.id_usuario);

        if (!usuario) {
            return errorResponse(
                res,
                'Usuario no encontrado',
                HTTP_STATUS.NOT_FOUND
            );
        }

        return successResponse(res, usuario, 'Perfil obtenido exitosamente');

    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
        return errorResponse(
            res,
            'Error al obtener perfil',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error
        );
    }
};

// ================================
// PUT - Actualizar perfil
// ================================
const updateProfile = async (req, res) => {
    try {
        const { nombre, telefono, direccion } = req.body;

        const usuario = await Usuario.findByPk(req.user.id_usuario);

        if (!usuario) {
            return errorResponse(
                res,
                'Usuario no encontrado',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Actualizar solo los campos proporcionados
        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (telefono !== undefined) datosActualizados.telefono = telefono;
        if (direccion !== undefined) datosActualizados.direccion = direccion;

        await usuario.update(datosActualizados);

        return successResponse(res, usuario, 'Perfil actualizado exitosamente');

    } catch (error) {
        console.error('❌ Error al actualizar perfil:', error);
        return errorResponse(
            res,
            'Error al actualizar perfil',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error
        );
    }
};

// ================================
// PUT - Cambiar contraseña
// ================================
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const usuario = await Usuario.findByPk(req.user.id_usuario, {
            attributes: { include: ['password'] }
        });

        if (!usuario) {
            return errorResponse(
                res,
                'Usuario no encontrado',
                HTTP_STATUS.NOT_FOUND
            );
        }

        // Verificar contraseña actual
        const passwordValido = await usuario.comparePassword(currentPassword);

        if (!passwordValido) {
            return errorResponse(
                res,
                'Contraseña actual incorrecta',
                HTTP_STATUS.UNAUTHORIZED
            );
        }

        // Actualizar contraseña (el hook beforeUpdate la hasheará)
        await usuario.update({ password: newPassword });

        return successResponse(res, null, 'Contraseña cambiada exitosamente');

    } catch (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        return errorResponse(
            res,
            'Error al cambiar contraseña',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error
        );
    }
};

module.exports = {
    register,
    login,
    refreshAccessToken,
    getProfile,
    updateProfile,
    changePassword
};