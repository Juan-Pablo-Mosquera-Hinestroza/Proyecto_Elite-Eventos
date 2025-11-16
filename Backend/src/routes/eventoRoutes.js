const express = require('express');
const router = express.Router();
const {
    getAllEventos,
    getEventoById,
    createEvento,
    updateEvento,
    cancelEvento,
    getEventosByUsuario,
    checkDisponibilidad,   // ← Mantener
    getFechasOcupadas      // ← Agregar
} = require('../controllers/eventoController');
const { authenticate } = require('../middlewares/auth');

// ✅ Obtener fechas ocupadas de una hacienda (para calendario)
router.get('/fechas-ocupadas', getFechasOcupadas);

// ✅ Verificar disponibilidad específica (con horarios)
router.get('/disponibilidad', checkDisponibilidad);

// Rutas existentes
router.get('/usuario/:id_usuario', getEventosByUsuario);
router.get('/', getAllEventos);
router.get('/:id', getEventoById);
router.post('/', createEvento);
router.put('/:id', updateEvento);
router.delete('/:id/cancelar', cancelEvento);

module.exports = router;