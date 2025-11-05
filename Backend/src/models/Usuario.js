const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    direccion: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [6, 255],
                msg: 'La contraseña debe tener al menos 6 caracteres'
            }
        }
    },
    rol: {
        type: DataTypes.ENUM('Admin', 'Cliente', 'Empleado'),
        defaultValue: 'Cliente'
    }
}, {
    tableName: 'Usuario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        // Hook para hashear contraseña antes de crear usuario
        beforeCreate: async (usuario) => {
            if (usuario.password) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        },
        // Hook para hashear contraseña antes de actualizar
        beforeUpdate: async (usuario) => {
            if (usuario.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                usuario.password = await bcrypt.hash(usuario.password, salt);
            }
        }
    }
});

/**
 * Método para comparar contraseñas
 */
Usuario.prototype.comparePassword = async function (passwordIngresado) {
    return await bcrypt.compare(passwordIngresado, this.password);
};

/**
 * Método para obtener usuario sin contraseña
 */
Usuario.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password; // No exponer password en JSON
    return values;
};

module.exports = Usuario;