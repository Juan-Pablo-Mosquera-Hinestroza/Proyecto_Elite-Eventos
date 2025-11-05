const { body, validationResult } = require('express-validator');
const { validationErrorResponse } = require('./responseHandler');

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return validationErrorResponse(res, errors.array());
    }

    next();
};

/**
 * Validaciones para registro
 */
const validateRegister = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

    body('telefono')
        .optional()
        .isMobilePhone('es-CO').withMessage('Debe ser un teléfono válido de Colombia'),

    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('La dirección no puede superar 200 caracteres'),

    handleValidationErrors
];

/**
 * Validaciones para login
 */
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    handleValidationErrors
];

/**
 * Validaciones para actualizar perfil
 */
const validateUpdateProfile = [
    body('nombre')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

    body('telefono')
        .optional()
        .isMobilePhone('es-CO').withMessage('Debe ser un teléfono válido de Colombia'),

    body('direccion')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('La dirección no puede superar 200 caracteres'),

    handleValidationErrors
];

/**
 * Validaciones para cambiar contraseña
 */
const validateChangePassword = [
    body('currentPassword')
        .notEmpty().withMessage('La contraseña actual es obligatoria'),

    body('newPassword')
        .notEmpty().withMessage('La nueva contraseña es obligatoria')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword,
    handleValidationErrors
};