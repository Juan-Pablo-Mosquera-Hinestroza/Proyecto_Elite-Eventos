import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Decoraciones.css';

const DecoracionServicios = () => {
  const [selectedDecoration, setSelectedDecoration] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  // Estados iniciales (fallback si falla la API)
  const [decorationOptions, setDecorationOptions] = useState([
    {
      id: 1,
      name: "Temático y Personalizado",
      price: 2500000,
      image: "./Fotos/Imagenes/deco_1.jpeg",
      features: [
        "Colores: Varian según la temática (rojo/negro para Hollywood, azul/plateado para gala espacial)",
        "Manteles y servilletas: Diseños personalizados con estampados y texturas específicas",
        "Platos y cubiertos: Vajilla especial con motivos según tema",
        "Iluminación: Luces personalizadas, neón, focos de colores",
        "Decoración adicional: Elementos icónicos del tema, fondos para fotos"
      ],
      idealFor: "Fiestas temáticas, cumpleaños, aniversarios, celebraciones creativas"
    },
    {
      id: 2,
      name: "Glamuroso y Extravagante",
      price: 1800000,
      image: "./Fotos/Imagenes/deco_2.jpeg",
      features: [
        "Colores: Dorado, plateado, negro, rojo, tonos metálicos",
        "Manteles y servilletas: Telas con brillo, lentejuelas, terciopelo o seda vibrante",
        "Platos y cubiertos: Vajilla con detalles dorados/plateados, cubiertos exclusivos",
        "Iluminación: Candelabros de cristal, lámparas de araña, luces LED especiales",
        "Decoración adicional: Centros con cristales, espejos, arreglos florales grandes"
      ],
      idealFor: "Galas, eventos de lujo, fiestas exclusivas"
    },
    {
      id: 3,
      name: "Clásico y Elegante",
      price: 1700000,
      image: "./Fotos/Imagenes/deco_3.jpeg",
      features: [
        "Colores: Blanco, dorado, plateado, marfil, tonos pastel",
        "Manteles y servilletas: Satén o lino con bordados o encajes",
        "Platos y cubiertos: Porcelana con detalles en oro/plata, acero pulido",
        "Iluminación: Candelabros, velas, luces cálidas",
        "Decoración adicional: Flores naturales, cristalería refinada"
      ],
      idealFor: "Bodas, cenas de gala, eventos corporativos"
    },
    {
      id: 4,
      name: "Rústico y Natural",
      price: 1700000,
      image: "./Fotos/Imagenes/deco_4.jpeg",
      features: [
        "Colores: Tonos tierra, beige, verde oliva, madera natural",
        "Manteles y servilletas: Yute, lino o algodón en colores cálidos",
        "Platos y cubiertos: Cerámica artesanal, bambú o acero mate",
        "Iluminación: Guirnaldas, velas en frascos, faroles",
        "Decoración adicional: Troncos, follaje, flores silvestres"
      ],
      idealFor: "Bodas al aire libre, eventos campestres"
    }
  ]);

  const [serviceOptions, setServiceOptions] = useState([
    {
      id: 1,
      name: "Fotografía y Video Profesional",
      icon: "fas fa-camera",
      description: "Captura los momentos más importantes con nuestro equipo profesional de fotografía y video.",
      features: ["Sesión previa", "Edición profesional", "Álbum digital"],
      price: 500000
    },
    {
      id: 2,
      name: "DJ y Música en Vivo",
      icon: "fas fa-music",
      description: "Ambienta tu evento con la mejor selección musical o artistas en vivo.",
      features: ["Equipo de sonido", "Lista personalizada", "Efectos de luces"],
      price: 500000
    },
    {
      id: 3,
      name: "Catering y Banquete",
      icon: "fas fa-utensils",
      description: "Menú gourmet adaptado a tus necesidades y preferencias alimenticias.",
      features: ["Chef profesional", "Variedad de menús", "Servicio de meseros"],
      price: 500000
    },
    {
      id: 4,
      name: "Transporte para Invitados",
      icon: "fas fa-bus",
      description: "Servicio de transporte seguro y cómodo para tus invitados.",
      features: ["Vehículos ejecutivos", "Rutas personalizadas", "Chofer profesional"],
      price: 500000
    },
    {
      id: 5,
      name: "Kit de Recuerdos",
      icon: "fas fa-gift",
      description: "Diseños personalizados de souvenirs para tus invitados.",
      features: ["Diseño exclusivo", "Variedad de productos", "Empaque premium"],
      price: 500000
    }
  ]);

  // ========================================
  // useEffect: Verificar y actualizar datos desde MySQL
  // ========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch decoraciones
        const resDecoraciones = await fetch('http://localhost:3000/api/decoraciones');
        const dataDecoraciones = await resDecoraciones.json();

        console.log('📦 Respuesta decoraciones:', dataDecoraciones);

        if (dataDecoraciones.success && dataDecoraciones.data) {
          const decoracionesDB = dataDecoraciones.data;

          if (Array.isArray(decoracionesDB) && decoracionesDB.length > 0) {
            const needsUpdateDecos = decoracionesDB.some((dbDeco) => {
              const existente = decorationOptions.find(d => d.id === dbDeco.id_decoracion);
              return existente && existente.price !== parseFloat(dbDeco.precio);
            });

            if (needsUpdateDecos || decoracionesDB.length !== decorationOptions.length) {
              console.log('📊 Actualizando decoraciones desde MySQL...');

              // Mantener solo las primeras 4 para coincidir con el diseño
              const decoracionesActualizadas = decorationOptions.map((deco, index) => {
                const dbDeco = decoracionesDB[index];
                if (dbDeco) {
                  return {
                    ...deco,
                    id: dbDeco.id_decoracion,
                    name: dbDeco.nombre || deco.name,
                    price: parseFloat(dbDeco.precio)
                  };
                }
                return deco;
              });

              setDecorationOptions(decoracionesActualizadas);
              console.log('✅ Decoraciones actualizadas:', decoracionesActualizadas.length);
            } else {
              console.log('✅ Decoraciones sincronizadas con la BD');
            }
          }
        }

        // Fetch servicios
        const resServicios = await fetch('http://localhost:3000/api/servicios');
        const dataServicios = await resServicios.json();

        console.log('📦 Respuesta servicios:', dataServicios);

        if (dataServicios.success && dataServicios.data) {
          const serviciosDB = dataServicios.data;

          if (Array.isArray(serviciosDB) && serviciosDB.length > 0) {
            const needsUpdateServicios = serviciosDB.some((dbServ) => {
              const existente = serviceOptions.find(s => s.id === dbServ.id_servicio);
              return existente && existente.price !== parseFloat(dbServ.precio);
            });

            if (needsUpdateServicios || serviciosDB.length !== serviceOptions.length) {
              console.log('📊 Actualizando servicios desde MySQL...');

              // Helper: Asignar icono según nombre del servicio
              const getServiceIcon = (nombre) => {
                const nombreLower = nombre.toLowerCase();
                if (nombreLower.includes('música') || nombreLower.includes('dj')) return 'fas fa-music';
                if (nombreLower.includes('catering') || nombreLower.includes('buffet') || nombreLower.includes('mesa')) return 'fas fa-utensils';
                if (nombreLower.includes('bebida') || nombreLower.includes('bar')) return 'fas fa-glass-cheers';
                if (nombreLower.includes('foto') || nombreLower.includes('video')) return 'fas fa-camera';
                if (nombreLower.includes('transporte') || nombreLower.includes('bus')) return 'fas fa-bus';
                if (nombreLower.includes('recuerdo') || nombreLower.includes('souvenir')) return 'fas fa-gift';
                return 'fas fa-star';
              };

              // Helper: Asignar features según el servicio
              const getServiceFeatures = (nombre) => {
                const nombreLower = nombre.toLowerCase();
                if (nombreLower.includes('música') || nombreLower.includes('dj')) {
                  return ["Equipo de sonido profesional", "Lista personalizada", "Efectos de luces"];
                }
                if (nombreLower.includes('buffet')) {
                  return ["Variedad de platos", "Estaciones de comida", "Servicio incluido"];
                }
                if (nombreLower.includes('mesa')) {
                  return ["Servicio a la mesa", "Menú personalizado", "Atención exclusiva"];
                }
                if (nombreLower.includes('bebida') || nombreLower.includes('premium')) {
                  return ["Barra libre", "Licores premium", "Bartender profesional"];
                }
                return ["Servicio completo", "Atención personalizada", "Garantía de calidad"];
              };

              // Mapear servicios de la BD
              const serviciosActualizados = serviciosDB.map(dbServ => {
                return {
                  id: dbServ.id_servicio,
                  name: dbServ.nombre,
                  icon: getServiceIcon(dbServ.nombre),
                  description: dbServ.descripcion || "Servicio profesional para tu evento",
                  features: getServiceFeatures(dbServ.nombre),
                  price: parseFloat(dbServ.precio)
                };
              });

              setServiceOptions(serviciosActualizados);
              console.log('✅ Servicios actualizados:', serviciosActualizados.length);
            } else {
              console.log('✅ Servicios sincronizados con la BD');
            }
          }
        }

      } catch (error) {
        console.error('⚠️ Error al verificar datos con la BD:', error);
      }
    };

    fetchData();
  }, []); // Solo ejecutar al montar el componente

  // Manejar selección de decoración
  const handleSelectDecoration = (decoration) => {
    setSelectedDecoration(decoration);
  };

  // Manejar añadir/remover servicios
  const handleToggleService = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  // Calcular total
  const calculateTotal = () => {
    let total = selectedDecoration ? selectedDecoration.price : 0;
    total += selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    return total;
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
    <div className="decoracion-servicios">
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

      <div className="decoration-container">
        {/* Sección de Decoración */}
        <section className="decoration-section">
          <div className="section-header">
            <h2 className="section-title1">Estilos de Decoración</h2>
            <p className="section-subtitle">Selecciona el estilo que mejor se adapte a tu evento</p>
          </div>

          <div className="decoration-options">
            {decorationOptions.map(decoration => (
              <div key={decoration.id} className="decoration-card">
                <div className="decoration-image1">
                  <img src={decoration.image} alt={decoration.name} />
                  <div className="price-tag">{formatPrice(decoration.price)}</div>
                </div>
                <div className="decoration-details1">
                  <h3>{decoration.name}</h3>
                  <ul className="decoration-features">
                    {decoration.features.map((feature, index) => (
                      <li key={index}>
                        <i className={`fas ${index === 0 ? 'fa-palette' : index === 1 ? 'fa-tshirt' : index === 2 ? 'fa-utensils' : index === 3 ? 'fa-lightbulb' : 'fa-star'}`}></i>
                        <strong>{feature.split(':')[0]}:</strong> {feature.split(':')[1]}
                      </li>
                    ))}
                  </ul>
                  <p className="ideal-for">
                    <i className="fas fa-heart"></i>
                    <strong>Ideal para:</strong> {decoration.idealFor}
                  </p>
                  <button
                    className={`btn-select ${selectedDecoration?.id === decoration.id ? 'selected' : ''}`}
                    onClick={() => handleSelectDecoration(decoration)}
                  >
                    {selectedDecoration?.id === decoration.id ? 'Seleccionado' : 'Seleccionar'}
                    <i className="fas fa-check-circle"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Servicios Adicionales */}
        <section className="services-section">
          <div className="section-header">
            <h2 className="section-title">Servicios Adicionales</h2>
            <p className="section-subtitle">Complementa tu evento con estos servicios especiales</p>
          </div>

          <div className="services-options">
            {serviceOptions.map(service => (
              <div key={service.id} className="service-card1">
                <div className="service-icon">
                  <i className={service.icon}></i>
                </div>
                <div className="service-details">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-features">
                    {service.features.map((feature, index) => (
                      <span key={index}>
                        <i className="fas fa-check-circle"></i> {feature}
                      </span>
                    ))}
                  </div>
                  <div className="service-actions">
                    <button
                      className={`btn-add ${selectedServices.find(s => s.id === service.id) ? 'selected' : ''}`}
                      onClick={() => handleToggleService(service)}
                    >
                      {selectedServices.find(s => s.id === service.id) ? 'Quitar' : 'Añadir'}
                      <i className={`fas ${selectedServices.find(s => s.id === service.id) ? 'fa-minus' : 'fa-plus'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <div className="services-summary">
            <h3>Resumen de Servicios y Decoración</h3>
            <div className="summary-items">
              {selectedDecoration ? (
                <div className="selected-item">
                  <span>{selectedDecoration.name}</span>
                  <span>{formatPrice(selectedDecoration.price)}</span>
                </div>
              ) : (
                <p>No has seleccionado decoración aún</p>
              )}

              {selectedServices.length > 0 ? (
                selectedServices.map(service => (
                  <div key={service.id} className="selected-item">
                    <span>{service.name}</span>
                    <span>{formatPrice(service.price)}</span>
                  </div>
                ))
              ) : (
                <p>No has seleccionado servicios adicionales aún</p>
              )}
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </div>
            <a className="btn-continue" href="../Factura_pago/Factura.html">
              Continuar con el Pago <i className="fas fa-arrow-right"></i>
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <Container className="py-5">
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
        </Container>
        <div className="copyright py-3 text-center">
          <p className="mb-0 small">© 2023 Elite Eventos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default DecoracionServicios;