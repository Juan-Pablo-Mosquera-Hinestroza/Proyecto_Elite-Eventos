const express = require('express');
const router = express.Router();
const {
    getAllHaciendas,
    getHaciendaById,
    createHacienda,
    updateHacienda,
    deleteHacienda
} = require('../controllers/haciendaController');

// ================================
// Rutas de Haciendas
// ================================

// GET /api/haciendas - Obtener todas
router.get('/', getAllHaciendas);

// GET /api/haciendas/:id - Obtener una por ID
router.get('/:id', getHaciendaById);

// POST /api/haciendas - Crear nueva
router.post('/', createHacienda);

// PUT /api/haciendas/:id - Actualizar existente
router.put('/:id', updateHacienda);

// DELETE /api/haciendas/:id - Eliminar
router.delete('/:id', deleteHacienda);

module.exports = router;