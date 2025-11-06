import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Haciendas.css';

const Haciendas = () => {
  // ================================
  // ESTADOS: Imágenes locales como base
  // ================================
  const imagenesLocales = {
    1: "./Fotos/Imagenes/Finca_1.jpg",
    2: "./Fotos/Imagenes/2.jpeg",
    3: "./Fotos/Imagenes/3.jpeg",
    4: "./Fotos/Imagenes/Finca_4.jpg"
  };

  const [haciendas, setHaciendas] = useState([
    {
      id: 1,
      nombre: "El Paraíso Escondido",
      precio: "$20.000.000",
      capacidad: "150 personas",
      ubicacion: "Cali, Valle",
      imagen: imagenesLocales[1],
      enlace: "/Hacienda1"
    },
    {
      id: 2,
      nombre: "Los Jardines del Sol",
      precio: "$25.000.000",
      capacidad: "200 personas",
      ubicacion: "Jamundí, Valle",
      imagen: imagenesLocales[2],
      enlace: "/Hacienda2"
    },
    {
      id: 3,
      nombre: "Polideportivo El Encanto Natural",
      precio: "$15.000.000",
      capacidad: "100 personas",
      ubicacion: "Yumbo, Valle",
      imagen: imagenesLocales[3],
      enlace: "/Hacienda3"
    },
    {
      id: 4,
      nombre: "Hacienda La Montaña",
      precio: "$35.000.000",
      capacidad: "450 personas",
      ubicacion: "Pance, Valle",
      imagen: imagenesLocales[4],
      enlace: "/Hacienda4"
    }
  ]);

  const [loading, setLoading] = useState(true);

  // ================================
  // useEffect: Actualizar SOLO datos dinámicos desde MySQL
  // ================================
  useEffect(() => {
    let isMounted = true;

    const fetchHaciendas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/haciendas');
        const data = await response.json();

        if (data.success && Array.isArray(data.data) && isMounted) {
          console.log('📦 Haciendas desde MySQL:', data.data.length, 'registros');

          // Mapear datos de MySQL pero MANTENER imágenes locales
          const haciendasFormateadas = data.data.map((h) => ({
            id: h.id_salon,
            nombre: h.nombre,
            precio: `$${Number(h.precio_base).toLocaleString('es-CO')}`,
            capacidad: `${h.capacidad} personas`,
            ubicacion: h.direccion,
            imagen: imagenesLocales[h.id_salon] || "./Fotos/Imagenes/Finca_1.jpg", // ← PRIORIZAR IMÁGENES LOCALES
            enlace: `/Hacienda${h.id_salon}`
          }));

          // Comparar solo datos relevantes (no imágenes)
          const hayDiferencias = JSON.stringify(haciendas.map(h => ({
            nombre: h.nombre,
            precio: h.precio,
            capacidad: h.capacidad
          }))) !== JSON.stringify(haciendasFormateadas.map(h => ({
            nombre: h.nombre,
            precio: h.precio,
            capacidad: h.capacidad
          })));

          if (hayDiferencias) {
            console.log('📊 Sincronizando datos desde MySQL (manteniendo imágenes locales)...');
            setHaciendas(haciendasFormateadas);

            setTimeout(() => {
              console.log('✅ Sincronización completada');
              console.table(haciendasFormateadas.map(h => ({
                ID: h.id,
                Nombre: h.nombre,
                Precio: h.precio,
                Capacidad: h.capacidad,
                Ubicación: h.ubicacion,
                Imagen: h.imagen // Verificar que sea la ruta local
              })));
            }, 100);
          } else {
            console.log('✅ Datos ya sincronizados (sin cambios)');
          }
        }
      } catch (error) {
        console.error('❌ Error al cargar haciendas:', error.message);
        console.log('⚠️ Usando datos locales del estado inicial');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHaciendas();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleContacto = () => {
    console.log('Redirigiendo a contacto...');
    alert('Función de contacto - En una implementación real redirigiría a Gmail');
  };

  const handleVerDetalles = (hacienda) => {
    console.log('Viendo detalles de:', hacienda.nombre);
    alert(`Viendo detalles de ${hacienda.nombre} - Precio: ${hacienda.precio}`);
  };

  // ================================
  // Loading State
  // ================================
  if (loading) {
    return (
      <div className="haciendas-container">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top px-4">
          <div className="container-fluid">
            <a className="navbar-brand fs-3 fw-bold" href="./visitor">
              <i className="fas fa-crown me-2"></i>Elite Eventos
            </a>
          </div>
        </nav>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          paddingTop: '100px'
        }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 fs-5">Cargando haciendas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="haciendas-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top px-4">
        <div className="container-fluid">
          <a className="navbar-brand fs-3 fw-bold" href="./visitor">
            <i className="fas fa-crown me-2"></i>Elite Eventos
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="haciendas-hero">
        <div className="hero-content">
          <h1>Nuestras Exclusivas Haciendas</h1>
          <p className="lead">Descubre los escenarios perfectos para tus eventos especiales</p>
        </div>
      </div>

      {/* Contenido */}
      <section className="container my-5 py-5">
        <div className="text-center mb-5">
          <h2 className="section-title">Haciendas Disponibles</h2>
          <p className="section-subtitle">Elige la hacienda que prefieras para tu evento</p>
        </div>

        <div className="row row-cols-1 row-cols-md-2 g-4 mt-4">
          {haciendas.map((hacienda) => (
            <div key={hacienda.id} className="col">
              <div className="card border-0 shadow-sm">
                <div className="card-img-container">
                  <img
                    src={hacienda.imagen}
                    className="card-img-top"
                    alt={hacienda.nombre}
                    onError={(e) => {
                      console.warn(`⚠️ Error cargando imagen local: ${hacienda.imagen}`);
                      // Fallback a imagen de Unsplash si la local falla
                      e.target.src = 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                    }}
                  />
                  <div className="price-tag">{hacienda.precio}</div>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{hacienda.nombre}</h5>
                  <div className="card-features">
                    <span>
                      <i className="fas fa-users me-2"></i>
                      Capacidad: {hacienda.capacidad}
                    </span>
                    <span>
                      <i className="fas fa-map-marker-alt me-2"></i>
                      {hacienda.ubicacion}
                    </span>
                  </div>
                  <button
                    className="btn btn-outline-primary mt-3 w-100 rounded-pill"
                    onClick={() => {
                      console.log(`🏠 Navegando a ${hacienda.enlace}`);
                      window.location.href = hacienda.enlace;
                    }}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5 bg-light">
        <div className="container text-center py-4">
          <h2 className="mb-4">¿No encuentras lo que buscas?</h2>
          <p className="mb-4">Tenemos más opciones disponibles. Contáctanos para ayudarte a encontrar la hacienda perfecta.</p>
          <button
            className="btn btn-primary btn-lg rounded-pill px-4"
            onClick={handleContacto}
          >
            Contáctanos
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer2">
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

export default Haciendas;