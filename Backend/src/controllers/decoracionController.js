const Decoracion = require('../models/Decoracion');

// ================================
// GET - Obtener todas las decoraciones
// ================================
const getAllDecoraciones = async (req, res) => {
    try {
        const decoraciones = await Decoracion.findAll();

        res.json({
            success: true,
            data: decoraciones,
            count: decoraciones.length
        });
    } catch (error) {
        console.error('Error al obtener decoraciones:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las decoraciones',
            error: error.message
        });
    }
};

// ================================
// GET - Obtener una decoración por ID
// ================================
const getDecoracionById = async (req, res) => {
    try {
        const { id } = req.params;
        const decoracion = await Decoracion.findByPk(id);

        if (!decoracion) {
            return res.status(404).json({
                success: false,
                message: 'Decoración no encontrada'
            });
        }

        res.json({
            success: true,
            data: decoracion
        });
    } catch (error) {
        console.error('Error al obtener decoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la decoración',
            error: error.message
        });
    }
};

// ================================
// POST - Crear nueva decoración
// ================================
const createDecoracion = async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;

        // Validaciones básicas
        if (!nombre || !precio) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: nombre, precio'
            });
        }

        const nuevaDecoracion = await Decoracion.create({
            nombre,
            descripcion,
            precio
        });

        res.status(201).json({
            success: true,
            message: 'Decoración creada exitosamente',
            data: nuevaDecoracion
        });
    } catch (error) {
        console.error('Error al crear decoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la decoración',
            error: error.message
        });
    }
};

// ================================
// PUT - Actualizar decoración
// ================================
const updateDecoracion = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio } = req.body;

        const decoracion = await Decoracion.findByPk(id);

        if (!decoracion) {
            return res.status(404).json({
                success: false,
                message: 'Decoración no encontrada'
            });
        }

        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
        if (precio !== undefined) datosActualizados.precio = precio;

        await decoracion.update(datosActualizados);

        res.json({
            success: true,
            message: 'Decoración actualizada exitosamente',
            data: decoracion
        });
    } catch (error) {
        console.error('Error al actualizar decoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la decoración',
            error: error.message
        });
    }
};

// ================================
// DELETE - Eliminar decoración
// ================================
const deleteDecoracion = async (req, res) => {
    try {
        const { id } = req.params;

        const decoracion = await Decoracion.findByPk(id);

        if (!decoracion) {
            return res.status(404).json({
                success: false,
                message: 'Decoración no encontrada'
            });
        }

        const decoracionEliminada = {
            id: decoracion.id_decoracion,
            nombre: decoracion.nombre
        };

        await decoracion.destroy();

        res.json({
            success: true,
            message: `Decoración "${decoracionEliminada.nombre}" eliminada exitosamente`,
            data: decoracionEliminada
        });
    } catch (error) {
        console.error('Error al eliminar decoración:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la decoración',
            error: error.message
        });
    }
};

module.exports = {
    getAllDecoraciones,
    getDecoracionById,
    createDecoracion,
    updateDecoracion,
    deleteDecoracion
};