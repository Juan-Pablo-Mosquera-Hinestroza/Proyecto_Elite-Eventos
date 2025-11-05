const express = require('express');
const cors = require('cors');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// ================================
// Middlewares Globales
// ================================
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5177', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// ================================
// Importar Rutas
// ================================
const haciendaRoutes = require('./routes/haciendaRoutes');
const decoracionRoutes = require('./routes/decoracionRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const eventoRoutes = require('./routes/eventoRoutes');

// ================================
// Ruta Principal (Health Check)
// ================================
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '✅ API de Elite Eventos funcionando correctamente',
        version: '2.0.0',
        database: 'MySQL - Elite_Eventos',
        timestamp: new Date().toISOString(),
        endpoints: {
            haciendas: '/api/haciendas',
            decoraciones: '/api/decoraciones',
            servicios: '/api/servicios',
            eventos: '/api/eventos',
            eventos_usuario: '/api/eventos/usuario/:id_usuario',
            disponibilidad: '/api/eventos/disponibilidad'
        }
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
    });
});

// ================================
// Usar Rutas de API
// ================================
app.use('/api/haciendas', haciendaRoutes);
app.use('/api/decoraciones', decoracionRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/eventos', eventoRoutes);

// ================================
// Manejo de Errores
// ================================
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;