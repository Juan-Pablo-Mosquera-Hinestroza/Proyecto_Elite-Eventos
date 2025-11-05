const { Evento, Hacienda, Usuario, Decoracion, Servicio, EventoServicio } = require('../models');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../config/constants');
const { Op } = require('sequelize');

// ================================
// GET - Obtener todos los eventos
// ================================
const getAllEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll({
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id_usuario', 'nombre', 'email', 'telefono']
                },
                {
                    model: Hacienda,
                    as: 'hacienda',
                    attributes: ['id_salon', 'nombre', 'direccion', 'capacidad']
                },
                {
                    model: Decoracion,
                    as: 'decoracion',
                    attributes: ['id_decoracion', 'nombre', 'precio']
                },
                {
                    model: EventoServicio,
                    as: 'evento_servicios',
                    include: [
                        {
                            model: Servicio,
                            as: 'servicio',
                            attributes: ['id_servicio', 'nombre', 'precio']
                        }
                    ]
                }
            ],
            order: [['fecha_evento', 'DESC'], ['created_at', 'DESC']]
        });

        return successResponse(res, {
            eventos,
            total: eventos.length
        }, 'Eventos obtenidos exitosamente');
    } catch (error) {
        console.error('❌ Error al obtener eventos:', error);
        return errorResponse(res, 'Error al obtener los eventos', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
};

// ================================
// GET - Obtener un evento por ID
// ================================
const getEventoById = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await Evento.findByPk(id, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id_usuario', 'nombre', 'email', 'telefono']
                },
                {
                    model: Hacienda,
                    as: 'hacienda',
                    attributes: ['id_salon', 'nombre', 'direccion', 'capacidad', 'imagen_url']
                },
                {
                    model: Decoracion,
                    as: 'decoracion',
                    attributes: ['id_decoracion', 'nombre', 'descripcion', 'precio']
                },
                {
                    model: EventoServicio,
                    as: 'evento_servicios',
                    include: [
                        {
                            model: Servicio,
                            as: 'servicio',
                            attributes: ['id_servicio', 'nombre', 'descripcion', 'precio']
                        }
                    ]
                }
            ]
        });

        if (!evento) {
            return notFoundResponse(res, 'Evento');
        }

        return successResponse(res, evento, 'Evento obtenido exitosamente');
    } catch (error) {
        console.error('❌ Error al obtener evento:', error);
        return errorResponse(res, 'Error al obtener el evento', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
};

// ================================
// GET - Obtener eventos de un usuario (PERFIL)
// ================================
const getEventosByUsuario = async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const eventos = await Evento.findAll({
            where: { id_usuario },
            include: [
                {
                    model: Hacienda,
                    as: 'hacienda',
                    attributes: ['id_salon', 'nombre', 'direccion', 'imagen_url']
                },
                {
                    model: Decoracion,
                    as: 'decoracion',
                    attributes: ['id_decoracion', 'nombre', 'precio']
                },
                {
                    model: EventoServicio,
                    as: 'evento_servicios',
                    include: [
                        {
                            model: Servicio,
                            as: 'servicio',
                            attributes: ['id_servicio', 'nombre', 'precio']
                        }
                    ]
                }
            ],
            order: [['fecha_evento', 'ASC']]
        });

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        return successResponse(res, {
            eventos,
            total: eventos.length,
            proximos: eventos.filter(e => new Date(e.fecha_evento) >= hoy).length,
            pasados: eventos.filter(e => new Date(e.fecha_evento) < hoy).length
        }, `Eventos del usuario obtenidos exitosamente`);
    } catch (error) {
        console.error('❌ Error al obtener eventos del usuario:', error);
        return errorResponse(res, 'Error al obtener los eventos del usuario', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
};

// ================================
// GET - Verificar disponibilidad de hacienda
// ================================
const checkDisponibilidad = async (req, res) => {
    try {
        const { id_salon, fecha_evento, hora_inicio, hora_fin } = req.query;

        if (!id_salon || !fecha_evento || !hora_inicio) {
            return errorResponse(
                res,
                'Faltan parámetros: id_salon, fecha_evento, hora_inicio',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const eventosEnFecha = await Evento.findAll({
            where: {
                id_salon,
                fecha_evento,
                estado: {
                    [Op.notIn]: ['Cancelado']
                }
            },
            attributes: ['id_evento', 'hora_inicio', 'hora_fin', 'estado', 'tipo_evento'],
            order: [['hora_inicio', 'ASC']]
        });

        const disponible = eventosEnFecha.length === 0;

        return successResponse(res, {
            disponible,
            fecha: fecha_evento,
            hacienda_id: id_salon,
            eventos_existentes: eventosEnFecha
        }, disponible ? '✅ Hacienda disponible' : '⚠️ Hacienda ocupada en esta fecha');

    } catch (error) {
        console.error('❌ Error al verificar disponibilidad:', error);
        return errorResponse(res, 'Error al verificar disponibilidad', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
};

// ================================
// POST - Crear nuevo evento
// ================================
const createEvento = async (req, res) => {
    try {
        const {
            id_usuario,
            id_salon,
            id_decoracion,
            fecha_evento,
            hora_inicio,
            hora_fin,
            numero_invitados,
            tipo_evento,
            tematica,
            descripcion,
            metodo_pago,
            servicios // Array: [{ id_servicio: 1, cantidad: 150 }, ...]
        } = req.body;

        // ================================
        // 1. VALIDAR CAMPOS OBLIGATORIOS
        // ================================
        if (!id_usuario || !id_salon || !fecha_evento || !hora_inicio || !numero_invitados) {
            return errorResponse(
                res,
                'Faltan campos obligatorios: id_usuario, id_salon, fecha_evento, hora_inicio, numero_invitados',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // ================================
        // 2. VERIFICAR QUE LA HACIENDA ESTÉ DISPONIBLE
        // ================================
        const horaFinEvento = hora_fin || '23:59:59';

        const eventoExistente = await Evento.findOne({
            where: {
                id_salon,
                fecha_evento,
                [Op.or]: [
                    {
                        hora_inicio: {
                            [Op.lte]: hora_inicio
                        },
                        hora_fin: {
                            [Op.gte]: hora_inicio
                        }
                    },
                    {
                        hora_inicio: {
                            [Op.lte]: horaFinEvento
                        },
                        hora_fin: {
                            [Op.gte]: horaFinEvento
                        }
                    },
                    {
                        hora_inicio: {
                            [Op.gte]: hora_inicio
                        },
                        hora_fin: {
                            [Op.lte]: horaFinEvento
                        }
                    }
                ],
                estado: {
                    [Op.notIn]: ['Cancelado']
                }
            }
        });

        if (eventoExistente) {
            return errorResponse(
                res,
                `La hacienda ya tiene un evento reservado el ${fecha_evento} de ${eventoExistente.hora_inicio} a ${eventoExistente.hora_fin}`,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // ================================
        // 3. VERIFICAR QUE EXISTAN LOS RECURSOS
        // ================================
        const hacienda = await Hacienda.findByPk(id_salon);
        if (!hacienda) {
            return notFoundResponse(res, 'Hacienda');
        }

        const usuario = await Usuario.findByPk(id_usuario);
        if (!usuario) {
            return notFoundResponse(res, 'Usuario');
        }

        let decoracion = null;
        if (id_decoracion) {
            decoracion = await Decoracion.findByPk(id_decoracion);
            if (!decoracion) {
                return notFoundResponse(res, 'Decoración');
            }
        }

        // Verificar capacidad
        if (numero_invitados > hacienda.capacidad) {
            return errorResponse(
                res,
                `La hacienda tiene capacidad para ${hacienda.capacidad} personas, pero solicitaste ${numero_invitados}`,
                HTTP_STATUS.BAD_REQUEST
            );
        }

        // ================================
        // 4. CALCULAR PRECIOS
        // ================================
        const precio_hacienda = parseFloat(hacienda.precio_base);
        const precio_decoracion = decoracion ? parseFloat(decoracion.precio) : 0;

        let precio_servicios = 0;
        const serviciosDetalles = [];

        if (servicios && servicios.length > 0) {
            for (const servItem of servicios) {
                const servicio = await Servicio.findByPk(servItem.id_servicio);
                if (!servicio) {
                    return notFoundResponse(res, `Servicio con ID ${servItem.id_servicio}`);
                }

                const cantidad = servItem.cantidad || 1;
                const precio_unitario = parseFloat(servicio.precio);
                const subtotal = precio_unitario * cantidad;

                precio_servicios += subtotal;

                serviciosDetalles.push({
                    id_servicio: servicio.id_servicio,
                    cantidad,
                    precio_unitario,
                    subtotal
                });
            }
        }

        const precio_total = precio_hacienda + precio_decoracion + precio_servicios;

        // ================================
        // 5. CREAR EL EVENTO
        // ================================
        const nuevoEvento = await Evento.create({
            id_usuario,
            id_salon,
            id_decoracion,
            fecha_evento,
            hora_inicio,
            hora_fin: horaFinEvento,
            numero_invitados,
            tipo_evento,
            tematica,
            descripcion,
            precio_hacienda,
            precio_decoracion,
            precio_servicios,
            precio_total,
            metodo_pago,
            estado: 'Pendiente'
        });

        // ================================
        // 6. AGREGAR SERVICIOS AL EVENTO
        // ================================
        if (serviciosDetalles.length > 0) {
            for (const servDetalle of serviciosDetalles) {
                await EventoServicio.create({
                    id_evento: nuevoEvento.id_evento,
                    ...servDetalle
                });
            }
        }

        // ================================
        // 7. OBTENER EL EVENTO COMPLETO
        // ================================
        const eventoCompleto = await Evento.findByPk(nuevoEvento.id_evento, {
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id_usuario', 'nombre', 'email', 'telefono']
                },
                {
                    model: Hacienda,
                    as: 'hacienda',
                    attributes: ['id_salon', 'nombre', 'direccion', 'capacidad']
                },
                {
                    model: Decoracion,
                    as: 'decoracion',
                    attributes: ['id_decoracion', 'nombre', 'precio']
                },
                {
                    model: EventoServicio,
                    as: 'evento_servicios',
                    include: [
                        {
                            model: Servicio,
                            as: 'servicio',
                            attributes: ['id_servicio', 'nombre', 'precio']
                        }
                    ]
                }
            ]
        });

        return successResponse(
            res,
            eventoCompleto,
            '✅ Evento creado exitosamente',
            HTTP_STATUS.CREATED
        );

    } catch (error) {
        console.error('❌ Error al crear evento:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return errorResponse(
                res,
                'Ya existe un evento en esta hacienda para la fecha y hora seleccionada',
                HTTP_STATUS.BAD_REQUEST,
                error
            );
        }

        return errorResponse(
            res,
            'Error al crear el evento',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            error
        );
    }
};

// ================================
// PUT - Actualizar evento
// ================================
const updateEvento = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, metodo_pago, descripcion } = req.body;

        const evento = await Evento.findByPk(id);

        if (!evento) {
            return notFoundResponse(res, 'Evento');
        }

        const datosActualizados = {};
        if (estado !== undefined) datosActualizados.estado = estado;
        if (metodo_pago !== undefined) datosActualizados.metodo_pago = metodo_pago;
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;

        await evento.update(datosActualizados);

        return successResponse(res, evento, 'Evento actualizado exitosamente');
    } catch (error) {
        console.error('❌ Error al actualizar evento:', error);
        return errorResponse(res, 'Error al actualizar el evento', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
};

// ================================
// DELETE - Cancelar evento
// ================================
const cancelEvento = async (req, res) => {
    try {
        const { id } = req.params;

        const evento = await Evento.findByPk(id);

        if (!evento) {
            return notFoundResponse(res, 'Evento');
        }

        await evento.update({ estado: 'Cancelado' });

        return successResponse(res, evento, 'Evento cancelado exitosamente');
    } catch (error) {
        console.error('❌ Error al cancelar evento:', error);
        return errorResponse(res, 'Error al cancelar el evento', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
};

module.exports = {
    getAllEventos,
    getEventoById,
    getEventosByUsuario,
    checkDisponibilidad,
    createEvento,
    updateEvento,
    cancelEvento
};