const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EventoServicio = sequelize.define('EventoServicio', {
    id_evento_servicio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_evento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Evento',
            key: 'id_evento'
        }
    },
    id_servicio: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Servicio_ad',
            key: 'id_servicio'
        }
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'Evento_Servicio', // ✅ CAMBIAR: Con guión bajo para coincidir con MySQL
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = EventoServicio;