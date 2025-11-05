import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Hacienda1.css';

const HaciendaDetail = () => {
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  // ================================
  // CAMBIO: Convertir hacienda en estado
  // ================================
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
    imagenes: [
      "./Fotos/Imagenes/Finca_1.jpg",
      "./Fotos/Imagenes/1.1.jpeg",
      "./Fotos/Imagenes/1.2.jpg",
      "./Fotos/Imagenes/1.3.jpg"
    ]
  });

  // ================================
  // useEffect: Actualizar desde la API
  // ================================
  useEffect(() => {
    let isMounted = true;

    const fetchHacienda = async () => {
      try {
        console.log('📡 Solicitando datos de Hacienda ID: 1...');

        const response = await fetch('http://localhost:3000/api/haciendas/1');
        const data = await response.json();

        if (data.success && isMounted) {
          console.log('📦 Datos recibidos de MySQL:', {
            nombre: data.data.nombre,
            precio: data.data.precio_base,
            capacidad: data.data.capacidad,
            ubicacion: data.data.direccion
          });

          const datosAnteriores = {
            nombre: hacienda.nombre,
            precio: hacienda.precio,
            capacidad: hacienda.capacidad,
            ubicacion: hacienda.ubicacion
          };

          // Actualizar datos
          const haciendaActualizada = {
            ...hacienda,
            nombre: data.data.nombre,
            precio: `$${Number(data.data.precio_base).toLocaleString('es-CO')}`,
            capacidad: `${data.data.capacidad} personas`,
            ubicacion: data.data.direccion,
            descripcion: data.data.descripcion || hacienda.descripcion
          };

          setHacienda(haciendaActualizada);

          // Log de confirmación con comparación
          setTimeout(() => {
            console.log('✅ Hacienda 1 sincronizada exitosamente');
            console.log('📊 Comparación de datos:');
            console.table({
              'Antes (hardcoded)': datosAnteriores,
              'Después (MySQL)': {
                nombre: haciendaActualizada.nombre,
                precio: haciendaActualizada.precio,
                capacidad: haciendaActualizada.capacidad,
                ubicacion: haciendaActualizada.ubicacion
              }
            });
          }, 100);
        }
      } catch (error) {
        console.error('❌ Error al cargar hacienda desde API:', error.message);
        console.log('⚠️ Usando datos por defecto (hardcoded)');
      }
    };

    fetchHacienda();

    return () => {
      isMounted = false;
    };
  }, []);

  const haciendasSimilares = [
    {
      id: 2,
      nombre: "Hacienda La Cascada",
      precio: "$25.000.000",
      capacidad: "200 personas",
      ubicacion: "Jamundí",
      imagen: "./Fotos/Imagenes/2.jpeg",
      enlace: "/Hacienda2"
    },
    {
      id: 3,
      nombre: "Hacienda Vista Hermosa",
      precio: "$15.000.000",
      capacidad: "100 personas",
      ubicacion: "Yumbo",
      imagen: "./Fotos/Imagenes/3.jpeg",
      enlace: "/Hacienda3"
    },
    {
      id: 4,
      nombre: "Hacienda San José",
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
                        haciendaSimilar.id === 2
                          ? window.location.href = "/hacienda2"
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

export default HaciendaDetail;