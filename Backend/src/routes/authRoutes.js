const express = require('express');
const router = express.Router();
const {
    register,
    login,
    refreshAccessToken,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const {
    validateRegister,
    validateLogin,
    validateUpdateProfile,
    validateChangePassword
} = require('../utils/validators');

// ================================
// Rutas públicas (sin autenticación)
// ================================

// POST /api/auth/register - Registro de usuario
router.post('/register', validateRegister, register);

// POST /api/auth/login - Login
router.post('/login', validateLogin, login);

// POST /api/auth/refresh - Renovar access token
router.post('/refresh', refreshAccessToken);

// ================================
// Rutas protegidas (requieren autenticación)
// ================================

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authenticate, getProfile);

// PUT /api/auth/profile - Actualizar perfil
router.put('/profile', authenticate, validateUpdateProfile, updateProfile);

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', authenticate, validateChangePassword, changePassword);

module.exports = router;