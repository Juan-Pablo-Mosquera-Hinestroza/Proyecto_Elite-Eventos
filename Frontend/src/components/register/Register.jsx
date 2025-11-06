import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Registro.css';

const Registro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ percentage: 0, color: 'danger' });
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    repetirPassword: '',
    terminos: false
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length > 0) strength += 10;
    if (password.length >= 8) strength += 30;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;

    let color = 'danger';
    if (strength > 70) color = 'success';
    else if (strength > 40) color = 'warning';

    return { percentage: Math.min(strength, 100), color };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← IMPORTANTE: Prevenir el comportamiento por defecto
    e.stopPropagation(); // ← IMPORTANTE: Detener la propagación del evento

    console.log('🔵 handleSubmit ejecutado');

    // Validaciones
    if (!formData.nombre || !formData.apellidos || !formData.email || !formData.telefono || !formData.password) {
      mostrarMensaje('Por favor completa todos los campos obligatorios', 'warning');
      return;
    }

    if (formData.password !== formData.repetirPassword) {
      mostrarMensaje('Las contraseñas no coinciden', 'danger');
      return;
    }

    if (!formData.terminos) {
      mostrarMensaje('Debes aceptar los términos y condiciones', 'warning');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        nombre: `${formData.nombre.trim()} ${formData.apellidos.trim()}`,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        telefono: formData.telefono.replace(/\s/g, ''),
        direccion: ''
      };

      console.log('📡 Enviando POST a /api/auth/register');
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST', // ← EXPLÍCITO
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('📊 Status HTTP:', response.status);
      console.log('📊 Response OK:', response.ok);

      const data = await response.json();
      console.log('📥 Respuesta completa:', JSON.stringify(data, null, 2));

      if (response.ok && data.success) {
        console.log('✅ Registro exitoso');

        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.usuario));

        mostrarMensaje('¡Registro exitoso! Redirigiendo...', 'success');

        setTimeout(() => {
          window.location.href = '/haciendas';
        }, 2000);
      } else {
        console.error('❌ Error del servidor:', data.message);
        mostrarMensaje(data.message || 'Error al registrar usuario', 'danger');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error de red:', error);
      mostrarMensaje('Error de conexión con el servidor', 'danger');
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top px-4">
        <div className="container-fluid">
          <a className="navbar-brand fs-3 fw-bold" href="/visitor">
            <i className="fas fa-crown me-2"></i>Elite Eventos
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="registro-hero">
        <div className="hero-content">
          <h1>Únete a Elite Eventos</h1>
          <p className="lead">Comienza a crear experiencias inolvidables</p>
        </div>
      </div>

      {/* Sección de Registro */}
      <section className="container my-5 py-5">
        <div className="row align-items-center">
          {/* Imagen Decorativa */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="image-container">
              <img
                src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Evento elegante"
                className="img-fluid rounded-elegant"
              />
              <div className="image-overlay">
                <h3>Transforma tus ideas en realidad</h3>
                <p>Con nuestro equipo de expertos en planificación de eventos</p>
              </div>
            </div>
          </div>

          {/* Formulario de Registro */}
          <div className="col-lg-6">
            <div className="form-container p-4 p-lg-5 shadow-sm">
              {/* Mensajes de Estado */}
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
                  {mensaje.texto}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMensaje({ texto: '', tipo: '' })}
                  ></button>
                </div>
              )}

              <h2 className="form-title mb-4">Crea tu cuenta</h2>
              <p className="form-subtitle mb-4">
                Todo empieza con una idea. Tal vez sueñas con crear un evento inolvidable,
                celebrar un momento especial o transformar una visión en una experiencia única.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        placeholder="Nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                      />
                      <label htmlFor="nombre">Nombre <span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <div className="col-md-6 mb-4">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="apellidos"
                        name="apellidos"
                        placeholder="Apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                      />
                      <label htmlFor="apellidos">Apellidos <span className="text-danger">*</span></label>
                    </div>
                  </div>
                </div>

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
                      disabled={loading}
                      required
                    />
                    <label htmlFor="email">Correo electrónico <span className="text-danger">*</span></label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-floating">
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                    />
                    <label htmlFor="telefono">Teléfono <span className="text-danger">*</span></label>
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
                      disabled={loading}
                      required
                    />
                    <label htmlFor="password">Contraseña <span className="text-danger">*</span></label>
                    <button
                      type="button"
                      className="btn btn-password-toggle"
                      onClick={() => togglePasswordVisibility('password')}
                      disabled={loading}
                    >
                      <i className={`far fa-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                  <div className="password-strength mt-2">
                    <div className="progress">
                      <div
                        className={`progress-bar bg-${passwordStrength.color}`}
                        role="progressbar"
                        style={{ width: `${passwordStrength.percentage}%` }}
                      ></div>
                    </div>
                    <small className="text-muted">Seguridad de la contraseña</small>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-floating position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="repetirPassword"
                      name="repetirPassword"
                      placeholder="Repita Contraseña"
                      value={formData.repetirPassword}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                    />
                    <label htmlFor="repetirPassword">Repita Contraseña <span className="text-danger">*</span></label>
                    <button
                      type="button"
                      className="btn btn-password-toggle"
                      onClick={() => togglePasswordVisibility('confirm')}
                      disabled={loading}
                    >
                      <i className={`far fa-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terminos"
                    name="terminos"
                    checked={formData.terminos}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                  <label className="form-check-label" htmlFor="terminos">
                    Acepto los <a href="#" className="text-decoration-none">Términos y Condiciones</a> y la <a href="#" className="text-decoration-none">Política de Privacidad</a>
                  </label>
                </div>

                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg rounded-pill"
                    id="btn-registro"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        Registrarme <i className="fas fa-arrow-right ms-2"></i>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="mb-0">
                    ¿Ya tienes una cuenta?
                    <a href="/login" className="fw-bold text-decoration-none ms-1">Inicia sesión</a>
                  </p>
                </div>
              </form>
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
    </div>
  );
};

export default Registro;