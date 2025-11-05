const express = require('express');
const router = express.Router();
const {
    getAllEventos,
    getEventoById,
    getEventosByUsuario,
    checkDisponibilidad,
    createEvento,
    updateEvento,
    cancelEvento
} = require('../controllers/eventoController');

// ================================
// Rutas de Eventos
// ================================

// GET /api/eventos/disponibilidad - Verificar disponibilidad (debe ir antes de /:id)
router.get('/disponibilidad', checkDisponibilidad);

// GET /api/eventos/usuario/:id_usuario - Eventos de un usuario (PERFIL)
router.get('/usuario/:id_usuario', getEventosByUsuario);

// GET /api/eventos - Obtener todos los eventos
router.get('/', getAllEventos);

// GET /api/eventos/:id - Obtener un evento por ID
router.get('/:id', getEventoById);

// POST /api/eventos - Crear nuevo evento
router.post('/', createEvento);

// PUT /api/eventos/:id - Actualizar evento
router.put('/:id', updateEvento);

// DELETE /api/eventos/:id/cancelar - Cancelar evento
router.delete('/:id/cancelar', cancelEvento);

module.exports = router;