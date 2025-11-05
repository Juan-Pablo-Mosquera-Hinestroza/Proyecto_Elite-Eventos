const express = require('express');
const router = express.Router();
const { getAllHaciendas, getHaciendaById } = require('../controllers/haciendaController');

// ================================
// Rutas de Haciendas
// ================================

// GET /api/haciendas - Obtener todas las haciendas
router.get('/', getAllHaciendas);

// GET /api/haciendas/:id - Obtener una hacienda específica
router.get('/:id', getHaciendaById);

module.exports = router;