import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReserva } from '../../contexts/ReservaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Opciones.css';
import eventosAPI from '../../api/eventosAPI';

const Opciones = () => {
  const navigate = useNavigate();
  const { reservaData, updateReserva } = useReserva();

  // ✅ Obtener datos del usuario desde localStorage
  const getUserData = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('❌ Error parseando datos de usuario:', error);
    }
    return null;
  };

  const userData = getUserData();

  // ✅ Separar nombre y apellidos del campo "nombre" completo
  const separarNombreCompleto = (nombreCompleto) => {
    if (!nombreCompleto) return { nombre: '', apellidos: '' };

    const partes = nombreCompleto.trim().split(' ');
    const nombre = partes[0] || '';
    const apellidos = partes.slice(1).join(' ') || '';

    return { nombre, apellidos };
  };

  const { nombre: nombreUsuario, apellidos: apellidosUsuario } = userData
    ? separarNombreCompleto(userData.nombre)
    : { nombre: '', apellidos: '' };

  // ✅ Estado del formulario con valores iniciales del usuario logueado
  const [formData, setFormData] = useState({
    nombre: reservaData.nombre || nombreUsuario,
    apellidos: reservaData.apellidos || apellidosUsuario,
    telefono: reservaData.telefono || userData?.telefono || '',
    email: reservaData.email || userData?.email || '',
    empresa: reservaData.empresa || '',
    contacto: '',
    hora: reservaData.hora_inicio || '',
    duracion: reservaData.duracion || '',
    tipo: reservaData.tipo_evento || '',
    tematica: reservaData.tematica || ''
  });

  // ✅ Mostrar indicador visual de que los datos están autocompletados
  const [datosAutocompletados, setDatosAutocompletados] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(reservaData.fecha_evento);
  const [selectedHacienda, setSelectedHacienda] = useState(reservaData.id_salon);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [loadingFechas, setLoadingFechas] = useState(false);

  // Datos de las haciendas
  const haciendas = [
    {
      id: 1,
      nombre: "El Paraiso Escondido",
      capacidad: "150 personas",
      imagen: "./Fotos/Imagenes/Finca_1.jpg",
      caracteristicas: ["Piscina", "Cocina", "Parqueadero"]
    },
    {
      id: 2,
      nombre: "Los Jardines Del Sol",
      capacidad: "200 personas",
      imagen: "./Fotos/Imagenes/2.jpeg",
      caracteristicas: ["Jardines", "Terraza", "Sonido"]
    },
    {
      id: 3,
      nombre: "El Encanto Natural",
      capacidad: "100 - 200 personas",
      imagen: "./Fotos/Imagenes/3.jpeg",
      caracteristicas: ["Vistas", "Chimenea", "Hospedaje"]
    },
    {
      id: 4,
      nombre: "Hacienda La Montaña",
      capacidad: "450 personas",
      imagen: "./Fotos/Imagenes/Finca_4.jpg",
      caracteristicas: ["Río", "Zona camping", "Caballos"]
    }
  ];

  // ==========================================
  // FUNCIONES
  // ==========================================

  // ✅ Cargar fechas ocupadas desde el backend
  const cargarFechasOcupadas = async () => {
    if (!selectedHacienda) return;

    setLoadingFechas(true);
    try {
      const mes = currentMonth.getMonth() + 1;
      const anio = currentMonth.getFullYear();

      console.log(`📅 Consultando disponibilidad para Hacienda ${selectedHacienda} - ${mes}/${anio}`);

      const response = await eventosAPI.getFechasOcupadas(selectedHacienda, mes, anio);

      if (response.data.success) {
        const fechas = response.data.data.fechas_ocupadas || [];
        setFechasOcupadas(fechas);
        console.log('🔴 Fechas ocupadas:', fechas);
      }
    } catch (error) {
      console.error('❌ Error cargando fechas ocupadas:', error);
      setFechasOcupadas([]);
    } finally {
      setLoadingFechas(false);
    }
  };

  // ✅ Verificar si una fecha está ocupada
  const esFechaOcupada = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0];
    return fechasOcupadas.includes(fechaStr);
  };

  // ✅ Calcular hora fin
  const calcularHoraFin = (horaInicio, duracionHoras) => {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const horaFinDate = new Date(0, 0, 0, horas + parseInt(duracionHoras), minutos);
    return `${String(horaFinDate.getHours()).padStart(2, '0')}:${String(horaFinDate.getMinutes()).padStart(2, '0')}:00`;
  };

  // ✅ Validar disponibilidad con horario específico
  const validarDisponibilidadConHorario = async () => {
    if (!selectedDate || !formData.hora || !formData.duracion) return true;

    try {
      const horaFin = calcularHoraFin(formData.hora, formData.duracion);

      const response = await eventosAPI.verificarDisponibilidad({
        id_salon: selectedHacienda,
        fecha_evento: selectedDate.toISOString().split('T')[0],
        hora_inicio: `${formData.hora}:00`,
        hora_fin: horaFin
      });

      if (!response.data.data.disponible) {
        const eventos = response.data.data.eventos_conflicto || [];
        alert(`⚠️ Horario no disponible\n\nEventos en conflicto:\n${eventos.map(e => `• ${e.horario} - ${e.tipo}`).join('\n')
          }`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error);
      alert('Error al verificar disponibilidad. Por favor intenta nuevamente.');
      return false;
    }
  };

  // ✅ Generar calendario OCULTANDO días ocupados
  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const calendarDays = [];

    // Días del mes anterior
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      calendarDays.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isDisabled: true,
        isHidden: false
      });
    }

    // Días del mes actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isPast = date < today;
      const isOcupado = esFechaOcupada(date);

      // Ocultar días ocupados
      if (isOcupado) {
        continue;
      }

      calendarDays.push({
        day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isDisabled: isPast,
        isPast,
        isOcupado: false,
        isHidden: false,
        date
      });
    }

    // Días del próximo mes
    const totalCells = 42;
    const remainingDays = totalCells - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        isDisabled: true,
        isHidden: false
      });
    }

    return calendarDays;
  };

  // Manejar cambios en formularios
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Navegación entre pasos
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Navegación del calendario
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Manejar selección de hacienda
  const handleHaciendaSelect = (haciendaId) => {
    setSelectedHacienda(haciendaId);
  };

  // Finalizar y guardar en contexto
  const handleFinalizar = async () => {
    // Validar disponibilidad con horario específico
    const disponible = await validarDisponibilidadConHorario();

    if (!disponible) {
      return;
    }

    // Validar campos obligatorios
    if (!selectedDate || !selectedHacienda || !formData.hora || !formData.tipo) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const haciendaSeleccionada = haciendas.find(h => h.id === selectedHacienda);

    // ✅ NO sobrescribir precio_hacienda si ya existe
    updateReserva({
      fecha_evento: selectedDate.toISOString().split('T')[0],
      hora_inicio: `${formData.hora}:00`,
      hora_fin: calcularHoraFin(formData.hora, formData.duracion),
      id_salon: selectedHacienda,
      haciendaNombre: haciendaSeleccionada?.nombre,
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      telefono: formData.telefono,
      email: formData.email,
      empresa: formData.empresa,
      tipo_evento: formData.tipo,
      tematica: formData.tematica,
      duracion: formData.duracion
      // ❌ NO INCLUIR: precio_hacienda: 0
    });

    console.log('✅ Datos guardados en contexto, navegando a decoraciones...');
    navigate('/decoraciones');
  };

  // ==========================================
  // EFFECTS
  // ==========================================

  // Cargar fechas ocupadas cuando cambie la hacienda o el mes
  useEffect(() => {
    if (selectedHacienda) {
      cargarFechasOcupadas();
    }
  }, [selectedHacienda, currentMonth]);

  // ✅ useEffect para marcar campos autocompletados
  useEffect(() => {
    if (userData) {
      setDatosAutocompletados(true);
      console.log('✅ Datos del usuario autocompletados:', {
        nombre: nombreUsuario,
        apellidos: apellidosUsuario,
        telefono: userData.telefono,
        email: userData.email
      });
    }
  }, []);

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="opciones-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/visitor">
            <span className="logo-icon"><i className="fas fa-crown"></i></span>
            <span className="logo-text">Elite Eventos</span>
          </a>
          <div className="navbar-actions">
            <a href="/Haciendas" className="nav-link active">Haciendas</a>
          </div>
        </div>
      </nav>

      {/* Progreso */}
      <div className="progress-container">
        <div className="progress-steps">
          {[1, 2, 3].map(step => (
            <div key={step} className={`step ${currentStep >= step ? 'active' : ''}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Fecha'}
                {step === 2 && 'Información'}
                {step === 3 && 'Evento'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="container my-5">
        {/* Paso 1: Calendario */}
        {currentStep === 1 && (
          <section className="planning-section calendar-section">
            <div className="section-header">
              <h2 className="section-title1">Elige la fecha para tu evento</h2>
              <p className="section-subtitle">Selecciona el día perfecto para tu ocasión especial</p>
            </div>

            {reservaData.haciendaNombre && (
              <div className="alert alert-info mb-3">
                <i className="fas fa-home me-2"></i>
                <strong>Hacienda:</strong> {reservaData.haciendaNombre}
              </div>
            )}

            {!selectedHacienda && (
              <div className="alert alert-warning mb-3">
                <i className="fas fa-exclamation-triangle me-2"></i>
                Por favor selecciona una hacienda primero
              </div>
            )}

            {loadingFechas && (
              <div className="text-center my-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Cargando disponibilidad...</span>
                </div>
                <p className="text-muted mt-2">Consultando fechas disponibles...</p>
              </div>
            )}

            <div className="calendar-container">
              <div className="calendar-header">
                <button className="nav-button" onClick={prevMonth}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <h3 className="month-year">
                  {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h3>
                <button className="nav-button" onClick={nextMonth}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>

              <div className="calendar-grid">
                <div className="weekdays">
                  {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                <div className="days">
                  {generateCalendar().map((dayInfo, index) => (
                    <div
                      key={index}
                      className={`day 
                      ${!dayInfo.isCurrentMonth ? 'disabled' : ''} 
                      ${dayInfo.isToday ? 'today' : ''} 
                      ${dayInfo.isSelected ? 'selected' : ''}
                      ${dayInfo.isPast ? 'past' : ''}
                    `}
                      onClick={() => {
                        if (dayInfo.isCurrentMonth && !dayInfo.isDisabled) {
                          setSelectedDate(dayInfo.date);
                          console.log('📅 Fecha seleccionada:', dayInfo.date.toISOString().split('T')[0]);
                        }
                      }}
                      style={{
                        cursor: dayInfo.isDisabled ? 'not-allowed' : 'pointer',
                        visibility: dayInfo.isHidden ? 'hidden' : 'visible'
                      }}
                    >
                      {dayInfo.day}
                    </div>
                  ))}
                </div>


              </div>

              <div className="section-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                  disabled={!selectedDate || !selectedHacienda}
                >
                  Siguiente <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Paso 2: Información Personal */}
        {currentStep === 2 && (
          <section className="planning-section info-section">
            <div className="section-header">
              <h2 className="section-title">Información del Cliente</h2>
              <p className="section-subtitle">
                {datosAutocompletados
                  ? 'Hemos completado tus datos automáticamente. Puedes editarlos si lo deseas.'
                  : 'Por favor completa tus datos para continuar'
                }
              </p>
            </div>

            {/* ✅ Alerta informativa si hay datos autocompletados */}
            {datosAutocompletados && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                <strong>Datos cargados automáticamente</strong> desde tu perfil.
                Puedes modificarlos si lo necesitas.
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDatosAutocompletados(false)}
                ></button>
              </div>
            )}

            <form className="info-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">
                    Nombre
                    {datosAutocompletados && (
                      <i className="fas fa-user-check text-success ms-2" title="Autocompletado"></i>
                    )}
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre"
                    className={datosAutocompletados ? 'form-control is-valid' : 'form-control'}
                    required
                  />
                  <div className="valid-feedback">
                    <i className="fas fa-check me-1"></i>Dato autocompletado
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="apellidos">
                    Apellidos
                    {datosAutocompletados && (
                      <i className="fas fa-user-check text-success ms-2" title="Autocompletado"></i>
                    )}
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    placeholder="Ingresa tus apellidos"
                    className={datosAutocompletados ? 'form-control is-valid' : 'form-control'}
                    required
                  />
                  <div className="valid-feedback">
                    <i className="fas fa-check me-1"></i>Dato autocompletado
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono">
                    Teléfono
                    {datosAutocompletados && formData.telefono && (
                      <i className="fas fa-phone-alt text-success ms-2" title="Autocompletado"></i>
                    )}
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Número de contacto"
                    className={datosAutocompletados && formData.telefono ? 'form-control is-valid' : 'form-control'}
                    required
                  />
                  {datosAutocompletados && formData.telefono && (
                    <div className="valid-feedback">
                      <i className="fas fa-check me-1"></i>Dato autocompletado
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Correo electrónico
                    {datosAutocompletados && (
                      <i className="fas fa-envelope-open-text text-success ms-2" title="Autocompletado"></i>
                    )}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className={datosAutocompletados ? 'form-control is-valid' : 'form-control'}
                    required
                  />
                  <div className="valid-feedback">
                    <i className="fas fa-check me-1"></i>Dato autocompletado
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="empresa">Empresa o Institución (Opcional)</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contacto">Preferencia de contacto</label>
                <select
                  id="contacto"
                  name="contacto"
                  value={formData.contacto}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="email">Correo electrónico</option>
                  <option value="llamada">Llamada telefónica</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </form>

            <div className="section-footer">
              <button className="btn btn-outline-secondary btn-prev" onClick={prevStep}>
                <i className="fas fa-arrow-left me-2"></i> Anterior
              </button>
              <button
                className="btn btn-primary btn-next"
                onClick={nextStep}
                disabled={!formData.nombre || !formData.apellidos || !formData.telefono || !formData.email}
              >
                Siguiente <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </section>
        )}

        {/* Paso 3: Detalles del Evento */}
        {currentStep === 3 && (
          <section className="planning-section event-section">
            <div className="section-header">
              <h2 className="section-title">Detalles del Evento</h2>
              <p className="section-subtitle">Personaliza los detalles de tu evento especial</p>
            </div>

            <form className="event-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="hora">Hora de inicio</label>
                  <input
                    type="time"
                    id="hora"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="duracion">Duración</label>
                  <select
                    id="duracion"
                    name="duracion"
                    value={formData.duracion}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecciona duración</option>
                    <option value="9">9 horas</option>
                    <option value="13">13 horas</option>
                    <option value="16">16 horas</option>
                    <option value="18">18 horas</option>
                    <option value="full-day">2 días completos</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo de evento</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecciona tipo de evento</option>
                  <option value="boda">Boda</option>
                  <option value="corporativo">Evento Corporativo</option>
                  <option value="social">Evento Social</option>
                  <option value="cumpleanos">Cumpleaños</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tematica">Temática del evento (Opcional)</label>
                <input
                  type="text"
                  id="tematica"
                  name="tematica"
                  value={formData.tematica}
                  onChange={handleInputChange}
                  placeholder="Ej: Vintage, Tropical, Formal..."
                />
              </div>

              <div className="form-group">
                <label>Selecciona una hacienda</label>
                <div className="haciendas-options">
                  {haciendas.map(hacienda => (
                    <div
                      key={hacienda.id}
                      className={`hacienda-card ${selectedHacienda === hacienda.id ? 'selected' : ''}`}
                      onClick={() => handleHaciendaSelect(hacienda.id)}
                    >
                      <div className="hacienda-image">
                        <img src={hacienda.imagen} alt={hacienda.nombre} />
                        <div className="select-overlay">
                          <i className="fas fa-check"></i>
                        </div>
                      </div>
                      <h3>{hacienda.nombre}</h3>
                      <p>Capacidad: {hacienda.capacidad}</p>
                      <div className="hacienda-features1">
                        {hacienda.caracteristicas.map((caracteristica, index) => (
                          <span key={index}>
                            <i className={`fas fa-${index === 0 ? 'swimming-pool' : index === 1 ? 'utensils' : 'parking'}`}></i>
                            {caracteristica}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <div className="section-footer">
              <button className="btn btn-outline-secondary btn-prev" onClick={prevStep}>
                <i className="fas fa-arrow-left me-2"></i> Anterior
              </button>
              <button
                className="btn btn-primary btn-next"
                onClick={handleFinalizar}
                disabled={!selectedHacienda || !formData.hora || !formData.duracion || !formData.tipo}
              >
                Siguiente <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Mensaje de Confirmación */}
      <div className="confirmation-message">
        <div className="container">
          <div className="message-box">
            <i className="fas fa-info-circle"></i>
            <p>
              Después de completar tu reserva, nos pondremos en contacto contigo para confirmar todos los detalles
              y aclarar cualquier duda que puedas tener. ¡Estamos aquí para hacer de tu evento algo inolvidable!
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer1">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="d-flex align-items-center">
                <i className="fas fa-crown me-2"></i>Elite Eventos
              </h5>
              <p className="mt-3">Transformando sueños en experiencias memorables desde 2010.</p>
              <div className="social-icons mt-3">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-pinterest-p"></i></a>
                <a href="#"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <h6>Ubicación</h6>
              <p className="mt-3">
                <i className="fas fa-map-marker-alt me-2"></i>Cl. 25 #127-220, Barrio Pance, Cali, Valle del Cauca
              </p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.647284090291!2d-76.555589!3d3.424757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwMjUnMjkuMSJOIDc2wrAzMycyMC4xIlc!5e0!3m2!1ses!2sco!4v1620000000000!5m2!1ses!2sco"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Ubicación Elite Eventos"
              ></iframe>
            </div>
            <div className="col-lg-4 mb-4">
              <h6>Contacto</h6>
              <p className="mt-3">
                <i className="fas fa-envelope me-2"></i>saamuel009@gmail.com<br />
                <i className="fas fa-phone me-2"></i>(57) 312 691 5311
              </p>
            </div>
          </div>
        </div>
        <div className="copyright py-3 text-center">
          <p className="mb-0 small">© 2023 Elite Eventos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Opciones;