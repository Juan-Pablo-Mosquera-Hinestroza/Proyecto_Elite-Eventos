const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evento = sequelize.define('Evento', {
    id_evento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'id_usuario'
        }
    },
    id_salon: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Salon',
            key: 'id_salon'
        }
    },
    id_decoracion: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Decoracion',
            key: 'id_decoracion'
        }
    },
    fecha_evento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: true
    },
    numero_invitados: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    tipo_evento: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tematica: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    precio_hacienda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    precio_decoracion: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    precio_servicios: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    descuento: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
    },
    precio_total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('Pendiente', 'Confirmado', 'Cancelado', 'Completado'),
        defaultValue: 'Pendiente'
    },
    metodo_pago: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'Evento',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Evento;