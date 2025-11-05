const Servicio = require('../models/Servicio');

// ================================
// GET - Obtener todos los servicios
// ================================
const getAllServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll();

        res.json({
            success: true,
            data: servicios,
            count: servicios.length
        });
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener los servicios',
            error: error.message
        });
    }
};

// ================================
// GET - Obtener un servicio por ID
// ================================
const getServicioById = async (req, res) => {
    try {
        const { id } = req.params;
        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        res.json({
            success: true,
            data: servicio
        });
    } catch (error) {
        console.error('Error al obtener servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el servicio',
            error: error.message
        });
    }
};

// ================================
// POST - Crear nuevo servicio
// ================================
const createServicio = async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;

        // Validaciones básicas
        if (!nombre || !precio) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: nombre, precio'
            });
        }

        const nuevoServicio = await Servicio.create({
            nombre,
            descripcion,
            precio
        });

        res.status(201).json({
            success: true,
            message: 'Servicio creado exitosamente',
            data: nuevoServicio
        });
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear el servicio',
            error: error.message
        });
    }
};

// ================================
// PUT - Actualizar servicio
// ================================
const updateServicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio } = req.body;

        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
        if (precio !== undefined) datosActualizados.precio = precio;

        await servicio.update(datosActualizados);

        res.json({
            success: true,
            message: 'Servicio actualizado exitosamente',
            data: servicio
        });
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el servicio',
            error: error.message
        });
    }
};

// ================================
// DELETE - Eliminar servicio
// ================================
const deleteServicio = async (req, res) => {
    try {
        const { id } = req.params;

        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({
                success: false,
                message: 'Servicio no encontrado'
            });
        }

        const servicioEliminado = {
            id: servicio.id_servicio,
            nombre: servicio.nombre
        };

        await servicio.destroy();

        res.json({
            success: true,
            message: `Servicio "${servicioEliminado.nombre}" eliminado exitosamente`,
            data: servicioEliminado
        });
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el servicio',
            error: error.message
        });
    }
};

module.exports = {
    getAllServicios,
    getServicioById,
    createServicio,
    updateServicio,
    deleteServicio
};