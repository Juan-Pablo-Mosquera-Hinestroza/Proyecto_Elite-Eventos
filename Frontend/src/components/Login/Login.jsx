import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones básicas
    if (!formData.email || !formData.password) {
      mostrarMensaje('Por favor completa todos los campos obligatorios', 'danger');
      setLoading(false);
      return;
    }

    // Simulación de inicio de sesión
    console.log('Datos de login:', formData);
    
    setTimeout(() => {
      setLoading(false);
      mostrarMensaje('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
      
      // Limpiar formulario después del login simulado
      setTimeout(() => {
        setFormData({
          email: '',
          password: '',
          remember: false
        });
      }, 2000);
    }, 2000);
  };

  return (
    <div className="login-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top px-4">
        <div className="container-fluid">
          <a className="navbar-brand fs-3 fw-bold" href="/Visitor">
            <i className="fas fa-crown me-2"></i>Elite Eventos
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="login-hero">
        <div className="hero-content">
          <h1>Bienvenido de vuelta</h1>
          <p className="lead">Accede a tu cuenta para gestionar tus eventos</p>
        </div>
      </div>

      {/* Login */}
      <section className="container my-5 py-5">
        <div className="row align-items-center justify-content-between">
          {/* Formulario */}
          <div className="col-lg-6">
            <div className="form-container p-4 p-lg-5 shadow-sm">
              <h2 className="form-title mb-4">Iniciar sesión</h2>
              <p className="mb-4">
                ¿Es tu primera vez? 
                <a href="/register" className="text-decoration-none fw-bold ms-1">
                  Regístrate
                </a>
              </p>

              {/* Mensajes */}
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show mb-4`} role="alert">
                  {mensaje.texto}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setMensaje({ texto: '', tipo: '' })}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <div className="form-floating">
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      name="email"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                    />
                    <label htmlFor="email">
                      Correo electrónico <span className="text-danger">*</span>
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="form-floating position-relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-control" 
                      id="password" 
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleInputChange}
                      required 
                    />
                    <label htmlFor="password">
                      Contraseña <span className="text-danger">*</span>
                    </label>
                    <button 
                      type="button" 
                      className="btn btn-link password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`far fa-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="remember" 
                      name="remember"
                      checked={formData.remember}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Recordarme
                    </label>
                  </div>
                  <small>
                    <a href="#" className="text-decoration-none">
                      ¿Olvidaste la contraseña?
                    </a>
                  </small>
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg rounded-pill" 
                    id="btn-login"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Verificando...
                      </>
                    ) : (
                      <a href="/haciendas" className="text-white text-decoration-none">
                        Ingresar <i className="fas fa-arrow-right ms-2"></i>
                      </a>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Imagen */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="image-container">
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Evento elegante" 
                className="img-fluid rounded-elegant" 
              />
              <div className="image-overlay">
                <h3>Gestiona tus eventos con nosotros</h3>
                <p>Accede a todas las herramientas para planificar tu evento perfecto</p>
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
                style={{border: 0}} 
                allowFullScreen="" 
                loading="lazy"
                title="Ubicación Elite Eventos"
              ></iframe>
            </div>
            <div className="col-lg-4 mb-4">
              <h6>Contacto</h6>
              <p className="mt-3">
                <i className="fas fa-envelope me-2"></i>saamuel009@gmail.com<br/>
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

export default Login;