const { Evento, Hacienda, Usuario, Decoracion, Servicio, EventoServicio } = require('../models');
const { successResponse, errorResponse, notFoundResponse } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../config/constants');
const { Op } = require('sequelize');
const pool = require('../config/database'); // ← AGREGAR ESTA LÍNEA

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
                'Faltan parámetros: id_salon, fecha_evento, hora_inicio son obligatorios',
                HTTP_STATUS.BAD_REQUEST
            );
        }

        const horaFinEvento = hora_fin || '23:59:59';

        // Buscar eventos que se solapen con el horario solicitado
        const eventosConflicto = await Evento.findAll({
            where: {
                id_salon,
                fecha_evento,
                estado: {
                    [Op.notIn]: ['Cancelado']
                },
                [Op.or]: [
                    // Caso 1: Evento existente comienza antes y termina después del inicio solicitado
                    {
                        hora_inicio: { [Op.lte]: hora_inicio },
                        hora_fin: { [Op.gt]: hora_inicio }
                    },
                    // Caso 2: Evento existente comienza antes del fin solicitado y termina después
                    {
                        hora_inicio: { [Op.lt]: horaFinEvento },
                        hora_fin: { [Op.gte]: horaFinEvento }
                    },
                    // Caso 3: Evento existente está completamente dentro del rango solicitado
                    {
                        hora_inicio: { [Op.gte]: hora_inicio },
                        hora_fin: { [Op.lte]: horaFinEvento }
                    }
                ]
            },
            attributes: ['id_evento', 'hora_inicio', 'hora_fin', 'estado', 'tipo_evento', 'numero_invitados'],
            order: [['hora_inicio', 'ASC']]
        });

        const disponible = eventosConflicto.length === 0;

        // Calcular rangos horarios disponibles si hay conflictos
        let horariosDisponibles = [];
        if (!disponible) {
            // Lógica para encontrar huecos entre eventos (opcional)
            horariosDisponibles = calcularHorariosDisponibles(eventosConflicto, fecha_evento);
        }

        return successResponse(res, {
            disponible,
            fecha: fecha_evento,
            horario_solicitado: {
                inicio: hora_inicio,
                fin: horaFinEvento
            },
            hacienda_id: parseInt(id_salon),
            eventos_conflicto: eventosConflicto.map(e => ({
                id: e.id_evento,
                horario: `${e.hora_inicio} - ${e.hora_fin}`,
                tipo: e.tipo_evento,
                invitados: e.numero_invitados
            })),
            horarios_alternativos: horariosDisponibles
        }, disponible
            ? '✅ Hacienda disponible para el horario solicitado'
            : `⚠️ Hacienda ocupada. ${eventosConflicto.length} evento(s) en conflicto`
        );

    } catch (error) {
        console.error('❌ Error al verificar disponibilidad:', error);
        return errorResponse(res, 'Error al verificar disponibilidad', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
};

// Función auxiliar para calcular horarios disponibles
const calcularHorariosDisponibles = (eventosOcupados, fecha) => {
    // Ordenar eventos por hora de inicio
    const ordenados = eventosOcupados.sort((a, b) =>
        a.hora_inicio.localeCompare(b.hora_inicio)
    );

    const disponibles = [];
    let horaActual = '06:00:00'; // Inicio del día laborable

    for (const evento of ordenados) {
        // Si hay espacio antes del evento
        if (horaActual < evento.hora_inicio) {
            disponibles.push({
                inicio: horaActual,
                fin: evento.hora_inicio,
                duracion_horas: calcularDiferenciaHoras(horaActual, evento.hora_inicio)
            });
        }

        // Actualizar hora actual al fin del evento
        horaActual = evento.hora_fin > horaActual ? evento.hora_fin : horaActual;
    }

    // Espacio después del último evento
    if (horaActual < '23:00:00') {
        disponibles.push({
            inicio: horaActual,
            fin: '23:59:59',
            duracion_horas: calcularDiferenciaHoras(horaActual, '23:59:59')
        });
    }

    return disponibles;
};

const calcularDiferenciaHoras = (horaInicio, horaFin) => {
    const [h1, m1] = horaInicio.split(':').map(Number);
    const [h2, m2] = horaFin.split(':').map(Number);
    return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
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
            descuento, // ✅ AGREGAR ESTE CAMPO
            precio_total, // ✅ AGREGAR (viene desde frontend con descuento aplicado)
            servicios // Array: [{ id_servicio: 1, cantidad: 150 }, ...]
        } = req.body;

        // ✅ LOG DE DEBUG
        console.log('📥 ========== DATOS RECIBIDOS DEL FRONTEND ==========');
        console.log('🎁 Descuento recibido:', descuento, typeof descuento);
        console.log('💰 Precio total recibido:', precio_total, typeof precio_total);
        console.log('📦 Body completo:', req.body);
        console.log('========================================');

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

        // ✅ USAR PRECIO TOTAL DESDE FRONTEND (ya incluye descuento)
        // Si no viene desde frontend, calcular aquí
        let precio_total_final = precio_total;
        if (!precio_total_final) {
            precio_total_final = precio_hacienda + precio_decoracion + precio_servicios;
        }

        // ✅ CONVERTIR DESCUENTO A NÚMERO
        const descuento_aplicado = descuento ? parseFloat(descuento) : 0;

        console.log('💰 ========== PRECIOS CALCULADOS ==========');
        console.log('🏛️ Precio hacienda:', precio_hacienda);
        console.log('🎨 Precio decoración:', precio_decoracion);
        console.log('⚙️ Precio servicios:', precio_servicios);
        console.log('🎁 Descuento:', descuento_aplicado);
        console.log('💳 Precio total final:', precio_total_final);
        console.log('=========================================');

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
            descuento: descuento_aplicado, // ✅ GUARDAR DESCUENTO
            precio_total: precio_total_final, // ✅ GUARDAR TOTAL CON DESCUENTO
            metodo_pago,
            estado: 'Pendiente'
        });

        console.log('✅ Evento creado en DB:', nuevoEvento.toJSON());

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

/**
 * Obtener fechas ocupadas de una hacienda
 */
const getFechasOcupadas = async (req, res) => {
    try {
        const { id_salon, mes, anio } = req.query;

        if (!id_salon) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro id_salon es obligatorio'
            });
        }

        // Construir condiciones WHERE
        let whereCondition = `id_salon = ${parseInt(id_salon)} AND estado != 'Cancelado'`;

        if (mes && anio) {
            const primerDia = `${anio}-${String(mes).padStart(2, '0')}-01`;
            const ultimoDiaNum = new Date(anio, mes, 0).getDate();
            const ultimaFecha = `${anio}-${String(mes).padStart(2, '0')}-${ultimoDiaNum}`;
            whereCondition += ` AND fecha_evento BETWEEN '${primerDia}' AND '${ultimaFecha}'`;
        } else {
            whereCondition += ` AND fecha_evento >= CURDATE()`;
        }

        const [eventos] = await pool.query(
            `SELECT fecha_evento, hora_inicio, hora_fin, tipo_evento 
       FROM Evento 
       WHERE ${whereCondition}
       ORDER BY fecha_evento ASC`
        );

        // Extraer solo las fechas (formato YYYY-MM-DD)
        const fechasOcupadas = eventos.map(e => {
            const fecha = new Date(e.fecha_evento);
            return fecha.toISOString().split('T')[0];
        });

        // Eliminar duplicados
        const fechasUnicas = [...new Set(fechasOcupadas)];

        console.log(`📅 Fechas ocupadas para hacienda ${id_salon}:`, fechasUnicas);

        res.json({
            success: true,
            message: 'Fechas ocupadas obtenidas correctamente',
            data: {
                id_salon: parseInt(id_salon),
                periodo: mes && anio ? `${mes}/${anio}` : 'Todos',
                fechas_ocupadas: fechasUnicas,
                total: fechasUnicas.length
            }
        });

    } catch (error) {
        console.error('❌ Error obteniendo fechas ocupadas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener fechas ocupadas',
            error: error.message
        });
    }
};

module.exports = {
    getAllEventos,
    getEventoById,
    getEventosByUsuario,
    checkDisponibilidad,
    getFechasOcupadas,  // ← EXPORTAR
    createEvento,
    updateEvento,
    cancelEvento
};