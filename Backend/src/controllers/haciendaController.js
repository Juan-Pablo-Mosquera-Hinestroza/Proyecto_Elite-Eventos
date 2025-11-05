const Hacienda = require('../models/Hacienda');

// ================================
// GET - Obtener todas las haciendas
// ================================
const getAllHaciendas = async (req, res) => {
    try {
        const haciendas = await Hacienda.findAll();

        res.json({
            success: true,
            data: haciendas,
            count: haciendas.length
        });
    } catch (error) {
        console.error('Error al obtener haciendas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las haciendas',
            error: error.message
        });
    }
};

// ================================
// GET - Obtener una hacienda por ID
// ================================
const getHaciendaById = async (req, res) => {
    try {
        const { id } = req.params;
        const hacienda = await Hacienda.findByPk(id);

        if (!hacienda) {
            return res.status(404).json({
                success: false,
                message: 'Hacienda no encontrada'
            });
        }

        res.json({
            success: true,
            data: hacienda
        });
    } catch (error) {
        console.error('Error al obtener hacienda:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la hacienda',
            error: error.message
        });
    }
};

// ================================
// POST - Crear nueva hacienda
// ================================
const createHacienda = async (req, res) => {
    try {
        const { nombre, direccion, capacidad, descripcion, precio_base, imagen_url } = req.body;

        // Validaciones básicas
        if (!nombre || !direccion || !capacidad || !precio_base) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios: nombre, direccion, capacidad, precio_base'
            });
        }

        // Crear hacienda
        const nuevaHacienda = await Hacienda.create({
            nombre,
            direccion,
            capacidad,
            descripcion,
            precio_base,
            imagen_url
        });

        res.status(201).json({
            success: true,
            message: 'Hacienda creada exitosamente',
            data: nuevaHacienda
        });
    } catch (error) {
        console.error('Error al crear hacienda:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la hacienda',
            error: error.message
        });
    }
};

// ================================
// PUT - Actualizar hacienda existente
// ================================
const updateHacienda = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, capacidad, descripcion, precio_base, imagen_url } = req.body;

        // Buscar hacienda
        const hacienda = await Hacienda.findByPk(id);

        if (!hacienda) {
            return res.status(404).json({
                success: false,
                message: 'Hacienda no encontrada'
            });
        }

        // Actualizar solo los campos enviados
        const datosActualizados = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (direccion !== undefined) datosActualizados.direccion = direccion;
        if (capacidad !== undefined) datosActualizados.capacidad = capacidad;
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
        if (precio_base !== undefined) datosActualizados.precio_base = precio_base;
        if (imagen_url !== undefined) datosActualizados.imagen_url = imagen_url;

        await hacienda.update(datosActualizados);

        res.json({
            success: true,
            message: 'Hacienda actualizada exitosamente',
            data: hacienda
        });
    } catch (error) {
        console.error('Error al actualizar hacienda:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la hacienda',
            error: error.message
        });
    }
};

// ================================
// DELETE - Eliminar hacienda
// ================================
const deleteHacienda = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar hacienda
        const hacienda = await Hacienda.findByPk(id);

        if (!hacienda) {
            return res.status(404).json({
                success: false,
                message: 'Hacienda no encontrada'
            });
        }

        // Guardar info antes de eliminar (para la respuesta)
        const haciendaEliminada = {
            id: hacienda.id_salon,
            nombre: hacienda.nombre
        };

        // Eliminar
        await hacienda.destroy();

        res.json({
            success: true,
            message: `Hacienda "${haciendaEliminada.nombre}" eliminada exitosamente`,
            data: haciendaEliminada
        });
    } catch (error) {
        console.error('Error al eliminar hacienda:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la hacienda',
            error: error.message
        });
    }
};

// ================================
// Exportar todas las funciones
// ================================
module.exports = {
    getAllHaciendas,
    getHaciendaById,
    createHacienda,
    updateHacienda,
    deleteHacienda
};