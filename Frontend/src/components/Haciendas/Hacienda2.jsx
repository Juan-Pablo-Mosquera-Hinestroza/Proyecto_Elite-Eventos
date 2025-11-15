import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReserva } from '../../contexts/ReservaContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Hacienda2.css';

const Hacienda2Detail = () => {
  const [activeThumbnail, setActiveThumbnail] = useState(0);
  const navigate = useNavigate();
  const { updateReserva } = useReserva();

  // ================================
  // IMÁGENES LOCALES FIJAS
  // ================================
  const imagenesLocales = [
    "./Fotos/Imagenes/2.jpeg",
    "./Fotos/Imagenes/2.1.jpg",
    "./Fotos/Imagenes/2.2.jpg",
    "./Fotos/Imagenes/2.3.jpg"
  ];

  const [hacienda, setHacienda] = useState({
    id: 2,
    nombre: "Los Jardines del Sol",
    precio: "$25.000.000",
    capacidad: "200-300 personas",
    ubicacion: "Jamundí, Valle del Cauca",
    calificacion: "4.8/5 (52 reseñas)",
    descripcion: "Una experiencia única rodeada de naturaleza y elegancia. Hacienda Los Jardines del Sol combina espacios al aire libre con áreas techadas de lujo, perfecta para bodas y eventos corporativos de gran escala.",
    caracteristicas: [
      "Capacidad para 200-300 invitados",
      "5 jardines temáticos diferentes",
      "Capilla colonial incluida",
      "Sistema de sonido profesional",
      "Cocina gourmet equipada",
      "20 habitaciones VIP",
      "Estacionamiento cubierto para 150 vehículos",
      "Área para niños con juegos"
    ],
    servicios: [
      { icono: "fas fa-utensils", titulo: "Catering Premium", descripcion: "Chef especializado incluido" },
      { icono: "fas fa-chair", titulo: "Mobiliario Deluxe", descripcion: "Decoración personalizada" },
      { icono: "fas fa-lightbulb", titulo: "Iluminación Artística", descripcion: "Efectos especiales LED" },
      { icono: "fas fa-music", titulo: "Sistema de Audio", descripcion: "Equipo profesional de sonido" }
    ],
    imagenes: imagenesLocales
  });

  useEffect(() => {
    let isMounted = true;

    const fetchHacienda = async () => {
      try {
        console.log('📡 Solicitando datos de Hacienda ID: 2...');

        const response = await fetch('http://localhost:3000/api/haciendas/2');
        const data = await response.json();

        if (data.success && isMounted) {
          console.log('📦 Datos recibidos de MySQL para Hacienda 2');

          const haciendaActualizada = {
            ...hacienda,
            nombre: data.data.nombre,
            precio: `$${Number(data.data.precio_base).toLocaleString('es-CO')}`,
            capacidad: `${data.data.capacidad} personas`,
            ubicacion: data.data.direccion,
            descripcion: data.data.descripcion || hacienda.descripcion,
            imagenes: imagenesLocales // ← MANTENER IMÁGENES LOCALES
          };

          setHacienda(haciendaActualizada);
          console.log('✅ Hacienda 2 sincronizada (datos MySQL + imágenes locales)');
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

  const handleReservar = () => {
    updateReserva({
      id_salon: hacienda.id,
      haciendaNombre: hacienda.nombre,
      precio_hacienda: parseFloat(hacienda.precio.replace(/[$,]/g, '')),
      capacidad_maxima: parseInt(hacienda.capacidad.split('-')[1] || hacienda.capacidad.split(' ')[0]),
      direccion_hacienda: hacienda.ubicacion
    });

    console.log('📍 Hacienda seleccionada:', hacienda.nombre);
    console.log('🆔 ID Salón:', hacienda.id);

    navigate('/opciones');
  };

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
            <h1 className="hero-title">{hacienda.nombre}</h1>
            <p className="hero-subtitle">Jardines exuberantes y elegancia natural</p>
          </div>
        </div>
      </header>

      <main className="container my-5">
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/Visitor"><i className="fas fa-home"></i></a></li>
            <li className="breadcrumb-item"><a href="/Haciendas">Haciendas</a></li>
            <li className="breadcrumb-item active">{hacienda.nombre}</li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-lg-8">
            <div className="hacienda-gallery mb-5">
              <div className="main-image">
                <img src={hacienda.imagenes[activeThumbnail]} alt={hacienda.nombre} className="img-fluid rounded-3" />
              </div>
              <div className="thumbnail-container">
                {hacienda.imagenes.map((imagen, index) => (
                  <div key={index} className={`thumbnail ${index === activeThumbnail ? 'active' : ''}`} onClick={() => handleThumbnailClick(index)}>
                    <img src={imagen} alt={`Vista ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <section className="hacienda-description mb-5">
              <h2 className="section-title">Descripción</h2>
              <p>{hacienda.descripcion}</p>
            </section>

            <section className="hacienda-features mb-5">
              <h2 className="section-title">Características Principales</h2>
              <div className="row">
                <div className="col-md-6">
                  <ul className="feature-list">
                    {hacienda.caracteristicas.slice(0, 4).map((caracteristica, index) => (
                      <li key={index}><i className="fas fa-check-circle"></i> {caracteristica}</li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="feature-list">
                    {hacienda.caracteristicas.slice(4).map((caracteristica, index) => (
                      <li key={index}><i className="fas fa-check-circle"></i> {caracteristica}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="hacienda-services mb-5">
              <h2 className="section-title">Servicios Incluidos</h2>
              <div className="service-cards">
                {hacienda.servicios.map((servicio, index) => (
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
                <h3>Reserva esta hacienda</h3>
                <div className="price">{hacienda.precio} <small>/ evento</small></div>
              </div>
              <div className="booking-body">
                <div className="booking-feature">
                  <i className="fas fa-users"></i>
                  <div><h5>Capacidad</h5><p>{hacienda.capacidad}</p></div>
                </div>
                <div className="booking-feature">
                  <i className="fas fa-map-marker-alt"></i>
                  <div><h5>Ubicación</h5><p>{hacienda.ubicacion}</p></div>
                </div>
                <div className="booking-feature">
                  <i className="fas fa-star"></i>
                  <div><h5>Calificación</h5><p>{hacienda.calificacion}</p></div>
                </div>
                <button className="btn btn-primary btn-book" onClick={handleReservar}>
                  Reservar ahora <i className="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <section className="similar-haciendas mt-5">
          <h2 className="section-title text-center mb-5">Otras haciendas que te pueden interesar</h2>
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

export default Hacienda2Detail;