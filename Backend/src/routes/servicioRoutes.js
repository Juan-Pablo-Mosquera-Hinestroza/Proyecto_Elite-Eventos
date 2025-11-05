const express = require('express');
const router = express.Router();
const {
    getAllServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio
} = require('../controllers/servicioController');

// ================================
// Rutas de Servicios
// ================================

// GET /api/servicios - Obtener todos
router.get('/', getAllServicios);

// GET /api/servicios/:id - Obtener uno por ID
router.get('/:id', getServicioById);

// POST /api/servicios - Crear nuevo
router.post('/', createServicio);

// PUT /api/servicios/:id - Actualizar existente
router.put('/:id', updateServicio);

// DELETE /api/servicios/:id - Eliminar
router.delete('/:id', deleteServicio);

module.exports = router;