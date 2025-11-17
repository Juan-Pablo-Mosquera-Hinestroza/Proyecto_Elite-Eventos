import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/Visitor.css';

const EliteEventos = () => {
  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar-v navbar-expand-lg navbar-dark px-4 fixed-top">
        <div className="container-fluid d-flex align-items-center">
          <a className="navbar-brand mx-auto fs-3 fw-bold" href="/visitor">
            <i className="fas fa-crown me-2"></i>Elite Eventos
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="ms-auto d-flex gap-3">
              <a href="/login" className="btn btn-outline-light rounded-pill px-3">
                Iniciar sesión
              </a>
              <a href="/register" className="btn btn-light text-dark rounded-pill px-3 fw-bold">
                Registrarme
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Creando momentos inolvidables</h1>
          <p className="lead">
            Nos especializamos en diseñar, planificar y gestionar experiencias únicas e inolvidables. Desde eventos corporativos, bodas, fiestas temáticas y celebraciones privadas, nuestro equipo se encarga de cada detalle para garantizar que cada ocasión sea un éxito.
          </p>
          <div className="mt-4">
            <a href="/sobrenosotros" className="btn btn-primary btn-lg rounded-pill px-4 me-2">Leer más</a>
            <a href="/Login" className="btn btn-outline-light btn-lg rounded-pill px-4">Crea un evento</a>
          </div>
        </div>
        <div className="scroll-down">
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>

      {/* Features Section */}
      <section className="features py-5">
        <div className="container">
          <h2 className="text-center mb-5">Nuestros Servicios</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <div className="icon-box mb-3">
                  <i className="fas fa-glass-cheers"></i>
                </div>
                <h3>Bodas</h3>
                <p>Celebra tu día especial con elegancia y estilo único.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <div className="icon-box mb-3">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3>Eventos Corporativos</h3>
                <p>Profesionalismo y creatividad para tus eventos empresariales.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card p-4 text-center">
                <div className="icon-box mb-3">
                  <i className="fas fa-birthday-cake"></i>
                </div>
                <h3>Fiestas Privadas</h3>
                <p>Celebraciones personalizadas que reflejan tu personalidad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
};

export default EliteEventos;