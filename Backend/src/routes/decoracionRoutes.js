const express = require('express');
const router = express.Router();
const {
    getAllDecoraciones,
    getDecoracionById,
    createDecoracion,
    updateDecoracion,
    deleteDecoracion
} = require('../controllers/decoracionController');

// ================================
// Rutas de Decoraciones
// ================================

// GET /api/decoraciones - Obtener todas
router.get('/', getAllDecoraciones);

// GET /api/decoraciones/:id - Obtener una por ID
router.get('/:id', getDecoracionById);

// POST /api/decoraciones - Crear nueva
router.post('/', createDecoracion);

// PUT /api/decoraciones/:id - Actualizar existente
router.put('/:id', updateDecoracion);

// DELETE /api/decoraciones/:id - Eliminar
router.delete('/:id', deleteDecoracion);

module.exports = router;