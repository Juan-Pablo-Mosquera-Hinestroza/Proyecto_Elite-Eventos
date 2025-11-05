const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// ================================
// Importar Rutas
// ================================
const authRoutes = require('./routes/authRoutes');
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
        version: '2.1.0',
        database: 'MySQL - Elite_Eventos',
        authentication: 'JWT',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                refresh: 'POST /api/auth/refresh',
                profile: 'GET /api/auth/profile (Protected)',
                updateProfile: 'PUT /api/auth/profile (Protected)',
                changePassword: 'PUT /api/auth/change-password (Protected)'
            },
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
app.use('/api/auth', authRoutes);
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