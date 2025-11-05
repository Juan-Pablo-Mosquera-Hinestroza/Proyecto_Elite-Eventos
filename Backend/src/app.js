const express = require('express');
const cors = require('cors');

const app = express();

// ================================
// Middlewares
// ================================
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5177', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Importar rutas
// ================================
const haciendaRoutes = require('./routes/haciendaRoutes');
const decoracionRoutes = require('./routes/decoracionRoutes');
const servicioRoutes = require('./routes/servicioRoutes'); // ← NUEVO

// ================================
// Usar rutas
// ================================
app.use('/api/haciendas', haciendaRoutes);
app.use('/api/decoraciones', decoracionRoutes);
app.use('/api/servicios', servicioRoutes); // ← NUEVO

// ================================
// Ruta de prueba
// ================================
app.get('/', (req, res) => {
    res.json({
        message: '✅ API de Elite Eventos funcionando correctamente',
        version: '1.0.0',
        database: 'MySQL - Elite_Eventos',
        endpoints: {
            haciendas: '/api/haciendas',
            hacienda_por_id: '/api/haciendas/:id',
            decoraciones: '/api/decoraciones',
            decoracion_por_id: '/api/decoraciones/:id',
            servicios: '/api/servicios', // ← NUEVO
            servicio_por_id: '/api/servicios/:id' // ← NUEVO
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// ================================
// Manejo de errores 404
// ================================
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path
    });
});

module.exports = app;