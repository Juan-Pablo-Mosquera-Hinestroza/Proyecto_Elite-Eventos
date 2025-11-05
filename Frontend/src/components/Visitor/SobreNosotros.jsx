import React, { useEffect } from "react";
import "./SobreNosotros.css"; // Ruta corregida

const SaberMas = () => {
  useEffect(() => {
    // Efecto de navbar al hacer scroll
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar');
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    // Animación de scroll
    const handleScrollClick = () => {
      const historySection = document.querySelector('.history-section');
      if (historySection) {
        window.scrollTo({
          top: historySection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', handleScrollClick);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollIndicator) {
        scrollIndicator.removeEventListener('click', handleScrollClick);
      }
    };
  }, []);

  return (
    <>
      {/* Navbar Elegante */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <a className="navbar-brand fs-3 fw-bold" href="/visitor">
            <i className="fas fa-crown me-2"></i>Elite Eventos
          </a>
          <div className="navbar-actions">
            <a href="/haciendas" className="nav-link">Haciendas</a>
            <a href="/login" className="nav-link">Iniciar sesión</a>
            <a href="/register" className="btn btn-primary">Registrarme</a>
          </div>
        </div>
      </nav>

      {/* Hero Section con nueva imagen */}
      <header className="about-hero">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <p className="hero-date">28 de mayo, 2023</p>
              <h1 className="hero-title">Creando Momentos Inolvidables</h1>
              <p className="hero-subtitle">La excelencia en cada detalle, la magia en cada evento</p>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <i className="fas fa-chevron-down"></i>
        </div>
      </header>

      {/* Sección Nuestra Historia con imagen premium */}
      <section className="about-section history-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-image">
                <img 
                  src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Equipo Elite Eventos" 
                  className="img-fluid"
                />
                <div className="image-caption">Nuestro equipo de expertos en eventos</div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <h2 className="section-title">
                  <span className="title-decorator"></span>
                  Nuestra Historia
                </h2>
                <p className="lead">Fundada en 2023, Elite Eventos nació de una visión compartida por un grupo de apasionados por la organización de eventos.</p>
                <p>Lo que comenzó como una pequeña startup en Cali, rápidamente se transformó en el referente nacional para la planificación de eventos excepcionales. Hoy contamos con un equipo multidisciplinario de más de 50 profesionales dedicados a hacer realidad tus sueños.</p>
                <div className="milestones">
                  <div className="milestone">
                    <div className="milestone-number">50+</div>
                    <div className="milestone-text">Eventos realizados</div>
                  </div>
                  <div className="milestone">
                    <div className="milestone-number">12</div>
                    <div className="milestone-text">Haciendas exclusivas</div>
                  </div>
                  <div className="milestone">
                    <div className="milestone-number">100%</div>
                    <div className="milestone-text">Satisfacción</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Qué Hacemos */}
      <section className="about-section what-we-do">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Nuestra Esencia</h2>
            <p className="section-subtitle">Transformamos visiones en experiencias memorables</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-magic"></i>
                </div>
                <h3>Diseño Creativo</h3>
                <p>Creamos conceptos únicos que reflejan tu personalidad y estilo, asegurando que cada evento sea una experiencia auténtica.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <h3>Planificación Impecable</h3>
                <p>Nuestro meticuloso proceso de planificación garantiza que cada detalle sea considerado y ejecutado a la perfección.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <h3>Experiencias Emocionales</h3>
                <p>Diseñamos momentos que conectan emocionalmente con tus invitados, creando recuerdos que perdurarán para siempre.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Galería con imágenes premium */}
      <section className="gallery-section">
        <div className="container-fluid">
          <div className="row g-0">
            <div className="col-md-4">
              <div className="gallery-item">
                <img 
                  src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Boda de lujo" 
                />
                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <h4>Bodas Exclusivas</h4>
                    <p>Celebraciones únicas</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="gallery-item">
                <img 
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Evento corporativo" 
                />
                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <h4>Eventos Corporativos</h4>
                    <p>Profesionalismo y elegancia</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="gallery-item">
                <img 
                  src="https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Fiesta temática" 
                />
                <div className="gallery-overlay">
                  <div className="overlay-content">
                    <h4>Fiestas Temáticas</h4>
                    <p>Creatividad sin límites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Valores con nueva imagen */}
      <section className="values-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="values-content">
                <h2 className="section-title">Nuestros Valores</h2>
                <div className="value-item">
                  <div className="value-number">01</div>
                  <div className="value-text">
                    <h3>Excelencia</h3>
                    <p>Buscamos la perfección en cada detalle, superando expectativas en calidad y servicio.</p>
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-number">02</div>
                  <div className="value-text">
                    <h3>Pasión</h3>
                    <p>Amamos lo que hacemos y eso se refleja en la energía y dedicación que ponemos en cada proyecto.</p>
                  </div>
                </div>
                <div className="value-item">
                  <div className="value-number">03</div>
                  <div className="value-text">
                    <h3>Innovación</h3>
                    <p>Constantemente exploramos nuevas ideas y tendencias para mantenernos a la vanguardia.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="values-image">
                <img 
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Detalle de evento elegante" 
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección CTA con nueva imagen de fondo */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>¿Listo para crear algo extraordinario?</h2>
            <p className="cta-text">Únete a la revolución en planificación de eventos y deja que nos encarguemos de cada detalle.</p>
            <div className="cta-buttons">
              <a href="/contacto" className="btn btn-primary btn-lg">Contáctanos</a>
              <a href="/haciendas" className="btn btn-outline-light btn-lg">Ver Haciendas</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer2">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="footer-brand">
                <span className="logo-icon"><i className="fas fa-crown"></i></span>
                <span className="logo-text">Elite Eventos</span>
              </div>
              <p className="footer-about">Transformando sueños en experiencias memorables desde 2010.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-pinterest-p"></i></a>
                <a href="#"><i className="fab fa-whatsapp"></i></a>
              </div>
            </div>
            <div className="col-lg-4">
              <h4 className="footer-title">Contacto</h4>
              <ul className="footer-links">
                <li><i className="fas fa-map-marker-alt"></i> Cl. 25 #127-220, Cali, Colombia</li>
                <li><i className="fas fa-phone"></i> +57 312 691 5311</li>
                <li><i className="fas fa-envelope"></i> saamuel009@gmail.com</li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h4 className="footer-title">Enlaces rápidos</h4>
              <ul className="footer-links">
                <li><a href="/">Inicio</a></li>
                <li><a href="/haciendas">Haciendas</a></li>
                <li><a href="/contacto">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2023 Elite Eventos. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default SaberMas;