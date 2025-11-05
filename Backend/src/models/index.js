const sequelize = require('../config/database');

// Importar modelos
const Hacienda = require('./Hacienda');
const Decoracion = require('./Decoracion');
const Servicio = require('./Servicio');
const Usuario = require('./Usuario');
const Evento = require('./Evento');
const EventoServicio = require('./EventoServicio');

// ================================
// Definir Relaciones
// ================================

// Usuario - Evento (1:N)
Usuario.hasMany(Evento, {
    foreignKey: 'id_usuario',
    as: 'eventos'
});
Evento.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'usuario'
});

// Hacienda - Evento (1:N)
Hacienda.hasMany(Evento, {
    foreignKey: 'id_salon',
    as: 'eventos'
});
Evento.belongsTo(Hacienda, {
    foreignKey: 'id_salon',
    as: 'hacienda'
});

// Decoracion - Evento (1:N)
Decoracion.hasMany(Evento, {
    foreignKey: 'id_decoracion',
    as: 'eventos'
});
Evento.belongsTo(Decoracion, {
    foreignKey: 'id_decoracion',
    as: 'decoracion'
});

// Evento - Servicio (M:N a través de EventoServicio)
Evento.belongsToMany(Servicio, {
    through: EventoServicio,
    foreignKey: 'id_evento',
    otherKey: 'id_servicio',
    as: 'servicios'
});
Servicio.belongsToMany(Evento, {
    through: EventoServicio,
    foreignKey: 'id_servicio',
    otherKey: 'id_evento',
    as: 'eventos'
});

// Relaciones directas con EventoServicio
Evento.hasMany(EventoServicio, {
    foreignKey: 'id_evento',
    as: 'evento_servicios'
});
EventoServicio.belongsTo(Evento, {
    foreignKey: 'id_evento'
});

Servicio.hasMany(EventoServicio, {
    foreignKey: 'id_servicio',
    as: 'evento_servicios'
});
EventoServicio.belongsTo(Servicio, {
    foreignKey: 'id_servicio',
    as: 'servicio'
});

// ================================
// Exportar modelos y sequelize
// ================================
module.exports = {
    sequelize,
    Hacienda,
    Decoracion,
    Servicio,
    Usuario,
    Evento,
    EventoServicio
};