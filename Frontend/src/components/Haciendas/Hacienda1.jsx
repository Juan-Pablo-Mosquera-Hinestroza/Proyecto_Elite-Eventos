import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReserva } from '../../contexts/ReservaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Hacienda1.css';

const HaciendaDetail = () => {
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const navigate = useNavigate();
  const { updateReserva } = useReserva();

  // ================================
  // IMÁGENES LOCALES FIJAS
  // ================================
  const imagenesLocales = [
    "./Fotos/Imagenes/Finca_1.jpg",
    "./Fotos/Imagenes/1.1.jpeg",
    "./Fotos/Imagenes/1.2.jpg",
    "./Fotos/Imagenes/1.3.jpg"
  ];

  const [hacienda, setHacienda] = useState({
    id: 1,
    nombre: "El Paraíso Escondido",
    precio: "$20.000.000",
    capacidad: "150-200 personas",
    ubicacion: "Valle del Cauca, Colombia",
    calificacion: "4.9/5 (47 reseñas)",
    descripcion: "Ubicada en un entorno natural rodeado de exuberante vegetación, la hacienda El Paraíso Escondido es el lugar perfecto para tu evento. Su arquitectura rústica con muros de piedra y techos de teja le da un encanto colonial, mientras que sus amplias terrazas permiten disfrutar de vistas panorámicas al jardín.",
    caracteristicas: [
      "Capacidad para 150-200 invitados",
      "3 salones de eventos con diferentes estilos",
      "Terraza exterior con vista al jardín",
      "Escenario profesional integrado",
      "Cocina industrial completamente equipada",
      "12 suites para invitados especiales",
      "Estacionamiento para 100 vehículos",
      "Acceso para personas con movilidad reducida"
    ],
    servicios: [
      { icono: "fas fa-utensils", titulo: "Catering Básico", descripcion: "Opciones de menú premium para elegir" },
      { icono: "fas fa-chair", titulo: "Mobiliario", descripcion: "Mesas, sillas y mantelería incluidos" },
      { icono: "fas fa-lightbulb", titulo: "Iluminación", descripcion: "Sistema profesional de iluminación" },
      { icono: "fas fa-swimming-pool", titulo: "Área de Piscina", descripcion: "Acceso y mantenimiento incluido" }
    ],
    imagenes: imagenesLocales // ← USAR IMÁGENES LOCALES
  });

  // ================================
  // useEffect: Actualizar SOLO datos desde MySQL
  // ================================
  useEffect(() => {
    const fetchHaciendaData = async () => {
      try {
        console.log('📡 Solicitando datos de Hacienda ID: 1...');
        const response = await fetch('http://localhost:3000/api/haciendas/1');
        const data = await response.json();

        console.log('📦 Datos recibidos de MySQL:', data);

        if (data.success) {
          const haciendaDB = data.data;

          // ✅ Guardar precio en el estado
          setHacienda(prevData => ({
            ...prevData,
            precio: `$${Number(haciendaDB.precio_base).toLocaleString('es-CO')}`,
            nombre: haciendaDB.nombre || prevData.nombre,
            descripcion: haciendaDB.descripcion || prevData.descripcion,
            capacidad: `${haciendaDB.capacidad_max} personas`,
            ubicacion: haciendaDB.direccion,
            imagenes: imagenesLocales // ← MANTENER IMÁGENES LOCALES
          }));

          console.log('✅ Hacienda 1 sincronizada (datos MySQL + imágenes locales)');
        }
      } catch (error) {
        console.error('❌ Error obteniendo datos de la hacienda:', error);
      }
    };

    fetchHaciendaData();
  }, []);

  const haciendasSimilares = [
    {
      id: 2,
      nombre: "Los Jardines del Sol",
      precio: "$25.000.000",
      capacidad: "200 personas",
      ubicacion: "Jamundí",
      imagen: "./Fotos/Imagenes/2.jpeg",
      enlace: "/Hacienda2"
    },
    {
      id: 3,
      nombre: "Polideportivo El Encanto Natural",
      precio: "$15.000.000",
      capacidad: "100 personas",
      ubicacion: "Yumbo",
      imagen: "./Fotos/Imagenes/3.jpeg",
      enlace: "/Hacienda3"
    },
    {
      id: 4,
      nombre: "Hacienda La Montaña",
      precio: "$35.000.000",
      capacidad: "450 personas",
      ubicacion: "Pance",
      imagen: "./Fotos/Imagenes/Finca_4.jpg",
      enlace: "/Hacienda4"
    }
  ];

  const handleThumbnailClick = (index) => {
    setActiveThumbnail(index);
  };

  // ✅ NUEVA FUNCIÓN para manejar la reserva
  const handleReservar = () => {
    // Convertir el precio de string "$20.000.000" a número 20000000
    const precioNumerico = parseFloat(hacienda.precio.replace(/[$.,]/g, ''));

    console.log('📍 Hacienda seleccionada:', hacienda.nombre);
    console.log('🆔 ID Salón:', hacienda.id);
    console.log('💰 Precio Base:', precioNumerico); // ✅ LOG CORREGIDO

    // ✅ Guardar ID, nombre Y PRECIO en contexto
    updateReserva({
      id_salon: hacienda.id,
      haciendaNombre: hacienda.nombre,
      precio_hacienda: precioNumerico || 0, // ✅ USAR precioNumerico
      capacidad_maxima: parseInt(hacienda.capacidad.split('-')[1] || hacienda.capacidad.split(' ')[0]),
      direccion_hacienda: hacienda.ubicacion
    });

    // Navegar a opciones
    navigate('/opciones');
  };

  return (
    <div className="hacienda-detail-container">
      {/* Navbar Elegante */}
      <nav className="navbar navbar-expand-lg fixed-top">
        <div className="container">
          <a className="navbar-brand" href="/Visitor">
            <span className="logo-icon"><i className="fas fa-crown"></i></span>
            <span className="logo-text">Elite Eventos</span>
          </a>
          <div className="navbar-actions">
            <a href="/haciendas" className="nav-link active">Haciendas</a>
          </div>
        </div>
      </nav>

      {/* Hero Section de la Hacienda */}
      <header className="hacienda-hero">
        <div className="hero-overlay">
          <div className="container">
            <h1 className="hero-title">{hacienda.nombre}</h1>
            <p className="hero-subtitle">Un refugio de elegancia rústica y naturaleza exuberante</p>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container my-5">
        {/* Migas de pan */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="./Visitor">
                <i className="fas fa-home"></i>
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/Haciendas">Haciendas</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {hacienda.nombre}
            </li>
          </ol>
        </nav>

        {/* Sección Principal */}
        <div className="row">
          <div className="col-lg-8">
            {/* Galería de imágenes */}
            <div className="hacienda-gallery mb-5">
              <div className="main-image">
                <img
                  src={hacienda.imagenes[activeThumbnail]}
                  alt={hacienda.nombre}
                  className="img-fluid rounded-3"
                  onError={(e) => {
                    console.warn(`⚠️ Error cargando imagen: ${e.target.src}`);
                    e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                  }}
                />
              </div>
              <div className="thumbnail-container">
                {hacienda.imagenes.map((imagen, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${index === activeThumbnail ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={imagen}
                      alt={`Vista ${index + 1}`}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Descripción detallada */}
            <section className="hacienda-description mb-5">
              <h2 className="section-title">Descripción</h2>
              <p>{hacienda.descripcion}</p>
            </section>

            {/* Características */}
            <section className="hacienda-features mb-5">
              <h2 className="section-title">Características Principales</h2>
              <div className="row">
                <div className="col-md-6">
                  <ul className="feature-list">
                    {hacienda.caracteristicas.slice(0, 4).map((caracteristica, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i> {caracteristica}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="feature-list">
                    {hacienda.caracteristicas.slice(4).map((caracteristica, index) => (
                      <li key={index}>
                        <i className="fas fa-check-circle"></i> {caracteristica}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Servicios incluidos */}
            <section className="hacienda-services mb-5">
              <h2 className="section-title">Servicios Incluidos</h2>
              <div className="service-cards">
                {hacienda.servicios.map((servicio, index) => (
                  <div key={index} className="service-card">
                    <div className="service-icon">
                      <i className={servicio.icono}></i>
                    </div>
                    <h4>{servicio.titulo}</h4>
                    <p>{servicio.descripcion}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar de reserva */}
          <div className="col-lg-4">
            <div className="booking-card">
              <div className="booking-header">
                <h3>Reserva esta hacienda</h3>
                <div className="price">
                  {hacienda.precio} <small>/ evento</small>
                </div>
              </div>
              <div className="booking-body">
                <div className="booking-feature">
                  <i className="fas fa-users"></i>
                  <div>
                    <h5>Capacidad</h5>
                    <p>{hacienda.capacidad}</p>
                  </div>
                </div>
                <div className="booking-feature">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h5>Ubicación</h5>
                    <p>{hacienda.ubicacion}</p>
                  </div>
                </div>
                <div className="booking-feature">
                  <i className="fas fa-star"></i>
                  <div>
                    <h5>Calificación</h5>
                    <p>{hacienda.calificacion}</p>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-book"
                  onClick={handleReservar}
                >
                  Reservar ahora <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de eventos similares */}
        <section className="similar-haciendas mt-5">
          <h2 className="section-title text-center mb-5">
            Otras haciendas que te pueden interesar
          </h2>
          <div className="row">
            {haciendasSimilares.map((haciendaSimilar) => (
              <div key={haciendaSimilar.id} className="col-md-4">
                <div className="hacienda-card">
                  <img
                    src={haciendaSimilar.imagen}
                    alt={haciendaSimilar.nombre}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                    }}
                  />
                  <div className="hacienda-info">
                    <h4>{haciendaSimilar.nombre}</h4>
                    <p className="price">{haciendaSimilar.precio}</p>
                    <div className="features">
                      <span>
                        <i className="fas fa-users"></i> {haciendaSimilar.capacidad}
                      </span>
                      <span>
                        <i className="fas fa-map-marker-alt"></i> {haciendaSimilar.ubicacion}
                      </span>
                    </div>
                    <button className="btn btn-outline-primary" onClick={() => window.location.href = haciendaSimilar.enlace}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="d-flex align-items-center">
                <i className="fas fa-crown me-2"></i>Elite Eventos
              </h5>
              <p className="mt-3">Transformando sueños en experiencias memorables desde 2010.</p>
            </div>
            <div className="col-lg-4 mb-4">
              <h6>Ubicación</h6>
              <p className="mt-3">
                <i className="fas fa-map-marker-alt me-2"></i>Cl. 25 #127-220, Barrio Pance, Cali
              </p>
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
      </footer>
    </div>
  );
};

export default HaciendaDetail;