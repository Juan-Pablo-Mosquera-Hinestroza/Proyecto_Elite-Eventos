const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'elite_eventos',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente');
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
        console.error('📋 Detalles del error:', error);
        throw error; // ← Importante: lanzar el error para que server.js lo capture
    }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;