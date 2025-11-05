import React, { useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap'; // <-- Importar componentes necesarios
import 'bootstrap/dist/css/bootstrap.min.css';
import './Factura.css';

const ResumenPedido = () => {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    fechaEvento: '',
    tipoEvento: '',
    totalInvitados: '',
    ubicacion: '',
    observaciones: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log('Datos del formulario:', formData);
    // En una aplicación real, aquí enviarías los datos a un backend
  };

  return (
    <div className="resumen-pedido">
      {/* Navbar */}
      <Navbar fixed="top" expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="/Visitor">
            <span className="logo-icon"><i className="fas fa-crown"></i></span>
            <span className="logo-text">Elite Eventos</span>
          </Navbar.Brand>
          <div className="navbar-actions">
            <Nav.Link href="/Haciendas" className="nav-link active">Haciendas</Nav.Link>
          </div>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main className="container1">
        <form onSubmit={handleSubmit} className="content1">
          <h2>
            <i className="fas fa-clipboard-check"></i> Resumen del Pedido
          </h2>

          {/* Campo Nombre del Cliente */}
          <div className="field">
            <label htmlFor="nombreCliente">
              <i className="fas fa-user"></i> Nombre del Cliente
            </label>
            <input
              type="text"
              id="nombreCliente"
              name="nombreCliente"
              value={formData.nombreCliente}
              onChange={handleInputChange}
              required
              placeholder="Ingrese su nombre completo"
            />
          </div>

          {/* Campo Fecha del Evento */}
          <div className="field">
            <label htmlFor="fechaEvento">
              <i className="fas fa-calendar-alt"></i> Fecha del Evento
            </label>
            <input
              type="date"
              id="fechaEvento"
              name="fechaEvento"
              value={formData.fechaEvento}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Campo Tipo de Evento */}
          <div className="field">
            <label htmlFor="tipoEvento">
              <i className="fas fa-glass-cheers"></i> Tipo de Evento
            </label>
            <select
              id="tipoEvento"
              name="tipoEvento"
              value={formData.tipoEvento}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Seleccione el tipo de evento</option>
              <option value="boda">Boda</option>
              <option value="cumpleanos">Cumpleaños</option>
              <option value="corporativo">Evento Corporativo</option>
              <option value="aniversario">Aniversario</option>
              <option value="graduacion">Graduación</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          {/* Campo Total de Invitados */}
          <div className="field">
            <label htmlFor="totalInvitados">
              <i className="fas fa-users"></i> Total de Invitados
            </label>
            <input
              type="number"
              id="totalInvitados"
              name="totalInvitados"
              value={formData.totalInvitados}
              onChange={handleInputChange}
              min="1"
              max="1000"
              required
              placeholder="Número de invitados"
            />
          </div>

          {/* Campo Ubicación */}
          <div className="field">
            <label htmlFor="ubicacion">
              <i className="fas fa-map-marker-alt"></i> Ubicación
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleInputChange}
              required
              placeholder="Dirección del evento"
            />
          </div>

          {/* Campo Observaciones */}
          <div className="field">
            <label htmlFor="observaciones">
              <i className="fas fa-edit"></i> Observaciones
            </label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleInputChange}
              placeholder="Información adicional sobre el evento (temática, requerimientos especiales, etc.)"
            />
          </div>

          {/* Botón de Confirmar */}
          <a 
            className="boton" 
            href="/Metodo"
            onClick={(e) => {
              // Validación básica antes de permitir la navegación
              const requiredFields = ['nombreCliente', 'fechaEvento', 'tipoEvento', 'totalInvitados', 'ubicacion'];
              const isValid = requiredFields.every(field => formData[field].trim() !== '');
              
              if (!isValid) {
                e.preventDefault();
                alert('Por favor, complete todos los campos requeridos antes de continuar.');
              }
            }}
          >
            <i className="fas fa-check-circle"></i> Confirmar Reserva
          </a>

          {/* Mensaje Informativo */}
          <div className="mensaje">
            <i className="fas fa-info-circle"></i>
            <p>
              📅 Estamos verificando la disponibilidad y nos pondremos en contacto contigo 
              en las próximas 24 horas para confirmar todos los detalles de tu evento especial.
            </p>
          </div>
        </form>

        {/* Sección de Imagen */}
        <section className="image-section">
          <div className="image-decoration decoration-1"></div>
          <div className="image-decoration decoration-2"></div>
          <img src="./Fotos/Imagenes/3.4.jpg" alt="Evento de lujo" />
        </section>
      </main>
    </div>
  );
};

export default ResumenPedido;