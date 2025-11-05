const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Decoracion = sequelize.define('Decoracion', {
    id_decoracion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    descripcion: {
        type: DataTypes.STRING(300),  // ← varchar(300), no TEXT
        allowNull: true
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }

}, {
    tableName: 'Decoracion',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Decoracion;