import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Hacienda2.css';

const Hacienda2 = () => {
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  const hacienda = {
    id: 2,
    nombre: "Los Jardines del Sol",
    precio: "$25.000.000",
    capacidad: "200 personas",
    ubicacion: "Jamundí, Valle del Cauca",
    calificacion: "4.8/5 (32 reseñas)",
    descripcion: "Ubicada en un entorno privilegiado de Jamundí, Los Jardines del Sol es una hacienda exclusiva diseñada para eventos inolvidables. Su arquitectura contemporánea con toques coloniales y sus exuberantes jardines tropicales crean un escenario perfecto para bodas, celebraciones y eventos corporativos.",
    caracteristicas: [
      "Capacidad para 150 invitados",
      "2 salones de eventos con diferentes estilos",
      "Terraza exterior con vista panorámica",
      "Escenario profesional integrado",
      "Cocina industrial completamente equipada",
      "8 suites para invitados especiales",
      "Estacionamiento para 80 vehículos",
      "Piscina infinita con área lounge"
    ],
    servicios: [
      { icono: "fas fa-utensils", titulo: "Catering Básico", descripcion: "Opciones de menú premium para elegir" },
      { icono: "fas fa-chair", titulo: "Mobiliario", descripcion: "Mesas, sillas y mantelería incluidos" },
      { icono: "fas fa-lightbulb", titulo: "Iluminación", descripcion: "Sistema profesional de iluminación" },
      { icono: "fas fa-wifi", titulo: "WiFi Premium", descripcion: "Conexión de alta velocidad" }
    ],
    imagenes: [
      "./Fotos/Imagenes/2.jpeg",
      "./Fotos/Imagenes/2.1.jpg",
      "./Fotos/Imagenes/2.2.jpg",
      "./Fotos/Imagenes/2.3.jpg"
    ]
  };

  // ================================
  // CAMBIO 3: Agregar useEffect para actualizar desde la API
  // ================================
  useEffect(() => {
    fetch('http://localhost:3000/api/haciendas/2')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Actualiza SOLO los campos que vienen de la BD
          setHacienda(prev => ({
            ...prev, // Mantiene todo lo demás (servicios, imágenes, características)
            nombre: data.data.nombre,
            precio: `$${Number(data.data.precio_base).toLocaleString('es-CO')}`,
            capacidad: `${data.data.capacidad} personas`,
            ubicacion: data.data.direccion,
            descripcion: data.data.descripcion
          }));
        }
      })
      .catch(err => {
        console.error('Error al cargar hacienda desde API:', err);
        // Si falla, mantiene los datos por defecto (los del useState inicial)
      });
  }, []);

  const haciendasSimilares = [
    {
      id: 1,
      nombre: "El Paraíso Escondido",
      precio: "$20.000.000",
      capacidad: "150 personas",
      ubicacion: "Cali",
      imagen: "./Fotos/Imagenes/Finca_1.jpg",
      enlace: "/Hacienda1"
    },
    {
      id: 3,
      nombre: "El Encanto Natural",
      precio: "$15.000.000",
      capacidad: "100 personas",
      ubicacion: "Yumbo",
      imagen: "../Fotos/Imagenes/3.jpeg",
      enlace: "Hacienda_3.html"
    },
    {
      id: 4,
      nombre: "Hacienda La Montaña",
      precio: "$35.000.000",
      capacidad: "450 personas",
      ubicacion: "Pance",
      imagen: "../Fotos/Imagenes/Finca_4.jpg",
      enlace: "Hacienda_4.html"
    }
  ];

  const handleThumbnailClick = (index) => {
    setActiveThumbnail(index);
  };

  const handleReservar = () => {
    console.log('Reservando hacienda:', hacienda.nombre);
    alert(`Redirigiendo a opciones de reserva para ${hacienda.nombre}`);
  };

  const handleContactar = () => {
    console.log('Contactando asesor...');
    alert('Función de contacto - En una implementación real redirigiría a Gmail');
  };

  const handleVerDetallesSimilar = (haciendaSimilar) => {
    console.log('Viendo detalles de hacienda similar:', haciendaSimilar.nombre);
    alert(`Viendo detalles de ${haciendaSimilar.nombre}`);
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
            <a href="/Haciendas" className="nav-link active">Haciendas</a>
          </div>
        </div>
      </nav>

      {/* Hero Section de la Hacienda */}
      <header
        className="hacienda-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${hacienda.imagenes[1]})`
        }}
      >
        <div className="hero-overlay">
          <div className="container">
            <h1 className="hero-title">{hacienda.nombre}</h1>
            <p className="hero-subtitle">Elegancia y naturaleza en perfecta armonía</p>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="container my-5">
        {/* Migas de pan */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/Visitor">
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
              <p>
                Ubicada en un entorno privilegiado de Jamundí,{" "}
                <strong>{hacienda.nombre}</strong> es una hacienda exclusiva diseñada para eventos inolvidables.
              </p>

              <p>
                Su arquitectura contemporánea con toques coloniales y sus exuberantes jardines tropicales
                crean un escenario perfecto para bodas, celebraciones y eventos corporativos. La combinación
                de espacios abiertos y áreas techadas ofrece versatilidad para cualquier tipo de evento,
                adaptándose a tus necesidades específicas.
              </p>

              <p>
                La propiedad cuenta con 10 hectáreas de terreno, incluyendo jardines meticulosamente
                diseñados, una piscina infinita con vista al valle y áreas de descanso que ofrecen
                intimidad y conexión con la naturaleza.
              </p>
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

                <button className="btn btn-primary btn-book" onClick={() => window.location.href = "/opciones"}>
                  Reservar ahora <i className="fas fa-arrow-right ms-2"></i>
                </button>

                <div className="contact-option">
                  <p>¿Prefieres hablar con un asesor?</p>
                  <button className="btn btn-outline-primary" onClick={handleContactar}>
                    <i className="fas fa-phone-alt me-2"></i> Contactar
                  </button>
                </div>
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
                    <button
                      className="btn btn-outline-primary"
                      onClick={() =>
                        haciendaSimilar.id === 1
                          ? window.location.href = "/hacienda1"
                          : haciendaSimilar.id === 3
                            ? window.location.href = "/hacienda3"
                            : haciendaSimilar.id === 4
                              ? window.location.href = "/hacienda4"
                              : handleVerDetallesSimilar(haciendaSimilar)
                      }
                    >
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

export default Hacienda2;