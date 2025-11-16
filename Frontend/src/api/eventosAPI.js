// filepath: /workspaces/Proyecto_Elite-Eventos/Frontend/src/api/eventosAPI.js
import axios from 'axios';

// URL base del backend
const API_BASE_URL = 'http://localhost:3000/api';

// Configuración de axios con token automático
const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ==========================================
// API DE EVENTOS
// ==========================================
const eventosAPI = {
  /**
   * Obtener fechas ocupadas de una hacienda
   * @param {number} idSalon - ID de la hacienda
   * @param {number} mes - Mes (1-12)
   * @param {number} anio - Año
   */
  getFechasOcupadas: async (idSalon, mes, anio) => {
    try {
      const params = { id_salon: idSalon };
      if (mes && anio) {
        params.mes = mes;
        params.anio = anio;
      }

      console.log('📅 Consultando fechas ocupadas:', params);

      const response = await axios.get(`${API_BASE_URL}/eventos/fechas-ocupadas`, {
        params,
        headers: getHeaders()
      });

      console.log('✅ Fechas ocupadas obtenidas:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo fechas ocupadas:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Verificar disponibilidad con horario específico
   * @param {Object} data - { id_salon, fecha_evento, hora_inicio, hora_fin }
   */
  verificarDisponibilidad: async (data) => {
    try {
      console.log('🔍 Verificando disponibilidad:', data);

      const response = await axios.get(`${API_BASE_URL}/eventos/disponibilidad`, {
        params: data,
        headers: getHeaders()
      });

      console.log('✅ Disponibilidad verificada:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Crear nuevo evento
   * @param {Object} eventoData - Datos del evento
   */
  create: async (eventoData) => {
    try {
      console.log('📤 Creando evento:', eventoData);

      const response = await axios.post(`${API_BASE_URL}/eventos`, eventoData, {
        headers: getHeaders()
      });

      console.log('✅ Evento creado:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Error creando evento:', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Obtener eventos del usuario actual
   * @param {number} userId - ID del usuario
   */
  getByUsuario: async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/eventos/usuario/${userId}`, {
        headers: getHeaders()
      });
      return response;
    } catch (error) {
      console.error('❌ Error obteniendo eventos del usuario:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default eventosAPI;
