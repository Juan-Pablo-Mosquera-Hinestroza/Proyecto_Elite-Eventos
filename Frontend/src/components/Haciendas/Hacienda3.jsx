import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Hacienda3.css';

const Hacienda3Detail = () => {
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  const [polideportivo, setPolideportivo] = useState({
    id: 3,
    nombre: "Hacienda Vista Hermosa",
    precio: "$15.000.000",
    capacidad: "100-150 personas",
    ubicacion: "Yumbo, Valle del Cauca",
    calificacion: "4.7/5 (38 reseñas)",
    descripcion: "Espacio deportivo adaptado para eventos sociales y corporativos. Ideal para celebraciones informales, team buildings y eventos al aire libre con instalaciones modernas.",
    caracteristicas: [
      "Capacidad para 100-150 invitados",
      "Cancha deportiva cubierta",
      "Área de recreación al aire libre",
      "Zona de juegos infantiles",
      "Cocina básica equipada",
      "6 baños completos",
      "Estacionamiento para 50 vehículos",
      "Accesibilidad total"
    ],
    servicios: [
      { icono: "fas fa-futbol", titulo: "Área Deportiva", descripcion: "Cancha multifuncional" },
      { icono: "fas fa-chair", titulo: "Mobiliario Básico", descripcion: "Mesas y sillas incluidas" },
      { icono: "fas fa-lightbulb", titulo: "Iluminación", descripcion: "Sistema LED eficiente" },
      { icono: "fas fa-parking", titulo: "Parqueadero", descripcion: "Amplio y seguro" }
    ],
    imagenes: [
      "./Fotos/Imagenes/3.jpeg",
      "./Fotos/Imagenes/3.1.jpeg",
      "./Fotos/Imagenes/3.2.jpeg",
      "./Fotos/Imagenes/3.3.jpeg"
    ]
  });

  useEffect(() => {
    let isMounted = true;

    const fetchPolideportivo = async () => {
      try {
        console.log('📡 Solicitando datos de Polideportivo ID: 3...');

        const response = await fetch('http://localhost:3000/api/haciendas/3');
        const data = await response.json();

        if (data.success && isMounted) {
          console.log('📦 Datos recibidos de MySQL:', {
            nombre: data.data.nombre,
            precio: data.data.precio_base,
            capacidad: data.data.capacidad,
            ubicacion: data.data.direccion
          });

          const datosAnteriores = {
            nombre: polideportivo.nombre,
            precio: polideportivo.precio,
            capacidad: polideportivo.capacidad,
            ubicacion: polideportivo.ubicacion
          };

          const polideportivoActualizado = {
            ...polideportivo,
            nombre: data.data.nombre,
            precio: `$${Number(data.data.precio_base).toLocaleString('es-CO')}`,
            capacidad: `${data.data.capacidad} personas`,
            ubicacion: data.data.direccion,
            descripcion: data.data.descripcion || polideportivo.descripcion
          };

          setPolideportivo(polideportivoActualizado);

          setTimeout(() => {
            console.log('✅ Polideportivo 3 sincronizado exitosamente');
            console.log('📊 Comparación de datos:');
            console.table({
              'Antes (hardcoded)': datosAnteriores,
              'Después (MySQL)': {
                nombre: polideportivoActualizado.nombre,
                precio: polideportivoActualizado.precio,
                capacidad: polideportivoActualizado.capacidad,
                ubicacion: polideportivoActualizado.ubicacion
              }
            });
          }, 100);
        }
      } catch (error) {
        console.error('❌ Error al cargar polideportivo desde API:', error.message);
        console.log('⚠️ Usando datos por defecto (hardcoded)');
      }
    };

    fetchPolideportivo();

    return () => {
      isMounted = false;
    };
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
      id: 2,
      nombre: "Hacienda La Cascada",
      precio: "$25.000.000",
      capacidad: "200 personas",
      ubicacion: "Jamundí",
      imagen: "./Fotos/Imagenes/2.jpeg",
      enlace: "/Hacienda2"
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

  return (
    <div className="hacienda-detail-container">
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

      <header className="hacienda-hero">
        <div className="hero-overlay">
          <div className="container">
            <h1 className="hero-title">{polideportivo.nombre}</h1>
            <p className="hero-subtitle">Espacio versátil para eventos activos</p>
          </div>
        </div>
      </header>

      <main className="container my-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/Visitor"><i className="fas fa-home"></i></a></li>
            <li className="breadcrumb-item"><a href="/Haciendas">Haciendas</a></li>
            <li className="breadcrumb-item active">{polideportivo.nombre}</li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-8">
            <div className="hacienda-gallery mb-5">
              <div className="main-image">
                <img src={polideportivo.imagenes[activeThumbnail]} alt={polideportivo.nombre} className="img-fluid rounded-3" />
              </div>
              <div className="thumbnail-container">
                {polideportivo.imagenes.map((imagen, index) => (
                  <div key={index} className={`thumbnail ${index === activeThumbnail ? 'active' : ''}`} onClick={() => handleThumbnailClick(index)}>
                    <img src={imagen} alt={`Vista ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <section className="hacienda-description mb-5">
              <h2 className="section-title">Descripción</h2>
              <p>{polideportivo.descripcion}</p>
            </section>

            <section className="hacienda-features mb-5">
              <h2 className="section-title">Características Principales</h2>
              <div className="row">
                <div className="col-md-6">
                  <ul className="feature-list">
                    {polideportivo.caracteristicas.slice(0, 4).map((caracteristica, index) => (
                      <li key={index}><i className="fas fa-check-circle"></i> {caracteristica}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="feature-list">
                    {polideportivo.caracteristicas.slice(4).map((caracteristica, index) => (
                      <li key={index}><i className="fas fa-check-circle"></i> {caracteristica}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="hacienda-services mb-5">
              <h2 className="section-title">Servicios Incluidos</h2>
              <div className="service-cards">
                {polideportivo.servicios.map((servicio, index) => (
                  <div key={index} className="service-card">
                    <div className="service-icon"><i className={servicio.icono}></i></div>
                    <h4>{servicio.titulo}</h4>
                    <p>{servicio.descripcion}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="col-lg-4">
            <div className="booking-card">
              <div className="booking-header">
                <h3>Reserva este espacio</h3>
                <div className="price">{polideportivo.precio} <small>/ evento</small></div>
              </div>
              <div className="booking-body">
                <div className="booking-feature">
                  <i className="fas fa-users"></i>
                  <div><h5>Capacidad</h5><p>{polideportivo.capacidad}</p></div>
                </div>
                <div className="booking-feature">
                  <i className="fas fa-map-marker-alt"></i>
                  <div><h5>Ubicación</h5><p>{polideportivo.ubicacion}</p></div>
                </div>
                <div className="booking-feature">
                  <i className="fas fa-star"></i>
                  <div><h5>Calificación</h5><p>{polideportivo.calificacion}</p></div>
                </div>
                <button className="btn btn-primary btn-book" onClick={() => window.location.href = "/opciones"}>
                  Reservar ahora <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="similar-haciendas mt-5">
          <h2 className="section-title text-center mb-5">Otras opciones que te pueden interesar</h2>
          <div className="row">
            {haciendasSimilares.map((h) => (
              <div key={h.id} className="col-md-4">
                <div className="hacienda-card">
                  <img src={h.imagen} alt={h.nombre} />
                  <div className="hacienda-info">
                    <h4>{h.nombre}</h4>
                    <p className="price">{h.precio}</p>
                    <div className="features">
                      <span><i className="fas fa-users"></i> {h.capacidad}</span>
                      <span><i className="fas fa-map-marker-alt"></i> {h.ubicacion}</span>
                    </div>
                    <button className="btn btn-outline-primary" onClick={() => window.location.href = h.enlace}>Ver detalles</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="d-flex align-items-center"><i className="fas fa-crown me-2"></i>Elite Eventos</h5>
              <p className="mt-3">Transformando sueños en experiencias memorables desde 2010.</p>
            </div>
            <div className="col-lg-4 mb-4">
              <h6>Ubicación</h6>
              <p className="mt-3"><i className="fas fa-map-marker-alt me-2"></i>Cl. 25 #127-220, Barrio Pance, Cali</p>
            </div>
            <div className="col-lg-4 mb-4">
              <h6>Contacto</h6>
              <p className="mt-3"><i className="fas fa-envelope me-2"></i>saamuel009@gmail.com<br /><i className="fas fa-phone me-2"></i>(57) 312 691 5311</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hacienda3Detail;