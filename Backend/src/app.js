const express = require('express');
const cors = require('cors');

const app = express();

// ================================
// Middlewares
// ================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Ruta de prueba
// ================================
app.get('/', (req, res) => {
    res.json({
        message: '✅ API de Elite Eventos funcionando correctamente',
        version: '1.0.0',
        database: 'MySQL - Elite_Eventos'
    });
});

// Ruta de health check
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