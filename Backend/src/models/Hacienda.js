const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Hacienda = sequelize.define('Salon', {
    id_salon: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    precio_base: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    imagen_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'Salon',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Hacienda;