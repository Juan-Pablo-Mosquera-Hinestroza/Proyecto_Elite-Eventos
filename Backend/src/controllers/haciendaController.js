const Hacienda = require('../models/Hacienda');

// ================================
// Obtener todas las haciendas
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
// Obtener una hacienda por ID
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

module.exports = {
    getAllHaciendas,
    getHaciendaById
};