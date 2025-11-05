import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Opciones.css';

const Opciones = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHacienda, setSelectedHacienda] = useState(null);
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    telefono: '',
    email: '',
    empresa: '',
    contacto: '',
    hora: '',
    duracion: '',
    tipo: '',
    tematica: ''
  });

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

  // Manejar selección de fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Manejar selección de hacienda
  const handleHaciendaSelect = (haciendaId) => {
    setSelectedHacienda(haciendaId);
  };

  // Manejar selección de decoración
  const handleDecorationSelect = (decoracionId) => {
    setSelectedDecoration(decoracionId);
  };

  // Manejar selección de servicios
  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Generar calendario
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
        isDisabled: true
      });
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      calendarDays.push({
        day,
        isCurrentMonth: true,
        isToday,
        isSelected,
        date
      });
    }
    
    // Días del próximo mes
    const totalCells = 42; // 6 semanas
    const remainingDays = totalCells - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        isDisabled: true
      });
    }
    
    return calendarDays;
  };

  // Navegación del calendario
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="opciones-container">
      {/* Navbar Elegante */}
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

      {/* Progreso del formulario */}
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
                      className={`day ${
                        !dayInfo.isCurrentMonth ? 'disabled' : ''
                      } ${dayInfo.isToday ? 'today' : ''} ${
                        dayInfo.isSelected ? 'selected' : ''
                      }`}
                      onClick={() => dayInfo.isCurrentMonth && handleDateSelect(dayInfo.date)}
                    >
                      {dayInfo.day}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="calendar-footer">
                <div className="availability-info">
                  <div className="availability-dot available"></div>
                  <span>Disponible</span>
                  <div className="availability-dot selected"></div>
                  <span>Seleccionado</span>
                </div>
              </div>
            </div>
            
            <div className="section-footer">
              <button 
                className="btn btn-primary btn-next" 
                onClick={nextStep}
                disabled={!selectedDate}
              >
                Siguiente <i className="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </section>
        )}

        {/* Paso 2: Información Personal */}
        {currentStep === 2 && (
          <section className="planning-section info-section">
            <div className="section-header">
              <h2 className="section-title">Información del Cliente</h2>
              <p className="section-subtitle">Por favor completa tus datos para continuar</p>
            </div>
            
            <form className="info-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    placeholder="Ingresa tus apellidos"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="Número de contacto"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    required
                  />
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

        {/* Paso 3: Personaliza tu Evento */}
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
                onClick={() => { window.location.href = '/decoraciones'; }}
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
                style={{border: 0}} 
                allowFullScreen="" 
                loading="lazy"
                title="Ubicación Elite Eventos"
              ></iframe>
            </div>
            <div className="col-lg-4 mb-4">
              <h6>Contacto</h6>
              <p className="mt-3">
                <i className="fas fa-envelope me-2"></i>saamuel009@gmail.com<br/>
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