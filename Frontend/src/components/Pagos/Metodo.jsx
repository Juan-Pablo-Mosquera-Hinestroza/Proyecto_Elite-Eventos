import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Metodo.css';

const MetodoPago = () => {
  const [formData, setFormData] = useState({
    planPago: '',
    metodoPago: 'efectivo',
    nombreTitular: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: '',
    tipoDocumento: 'cc',
    pais: 'colombia',
    direccion1: '',
    direccion2: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    terminos: false
  });

  const [valores, setValores] = useState({
    hacienda: 5000000,
    decoracion: 1800000,
    servicios: 500000,
    impuestos: 230000
  });

  const [totalPagar, setTotalPagar] = useState(0);

  // Calcular total inicial
  useEffect(() => {
    const total = calcularTotal();
    setTotalPagar(total);
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejar cambio de método de pago
  const handleMetodoPagoChange = (metodo) => {
    setFormData(prevState => ({
      ...prevState,
      metodoPago: metodo
    }));
  };

  // Manejar cambio en plan de pago
  const handlePlanPagoChange = (e) => {
    const plan = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      planPago: plan
    }));

    const totalBase = calcularTotal();
    let nuevoTotal = totalBase;

    if (plan === 'completo') {
      // Aplicar 5% de descuento
      nuevoTotal = totalBase * 0.95;
    } else if (plan === 'inicial') {
      // Pago inicial del 50%
      nuevoTotal = totalBase * 0.5;
    }

    setTotalPagar(nuevoTotal);
  };

  // Calcular total
  const calcularTotal = () => {
    return valores.hacienda + valores.decoracion + valores.servicios + valores.impuestos;
  };

  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.terminos) {
      alert('Debe aceptar los términos y condiciones para continuar.');
      return;
    }

    // Aquí iría la lógica de procesamiento de pago
    console.log('Datos del pago:', formData);
    console.log('Total a pagar:', totalPagar);
    
    // Simulación de procesamiento exitoso
    alert('¡Pago procesado exitosamente! Será redirigido a la página de confirmación.');
    
    // En una aplicación real, aquí redirigirías o mostrarías confirmación
  };

  // Obtener número de tarjeta formateado para vista previa
  const getCardNumberPreview = () => {
    if (!formData.numeroTarjeta) return '•••• •••• •••• 4242';
    return formData.numeroTarjeta;
  };

  // Obtener nombre del titular para vista previa
  const getCardNamePreview = () => {
    if (!formData.nombreTitular) return 'NOMBRE TITULAR';
    return formData.nombreTitular.toUpperCase();
  };

  // Obtener fecha de expiración para vista previa
  const getCardExpiryPreview = () => {
    if (!formData.fechaExpiracion) return 'MM/AA';
    return formData.fechaExpiracion;
  };

  return (
    <div className="metodo-pago">
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

      {/* Main Content */}
      <main className="container1">
        <form className="form-section" onSubmit={handleSubmit}>
          <h2>Método de Pago <span>- Mis Reservas</span></h2>
          
          {/* Resumen del pedido */}
          <div className="resumen-pago">
            <h3><i className="fas fa-receipt"></i> Resumen de tu pedido</h3>
            <div className="resumen-item">
              <span>Valor de la hacienda:</span>
              <span>{formatCurrency(valores.hacienda)}</span>
            </div>
            <div className="resumen-item">
              <span>Decoración seleccionada:</span>
              <span>{formatCurrency(valores.decoracion)}</span>
            </div>
            <div className="resumen-item">
              <span>Servicios adicionales:</span>
              <span>{formatCurrency(valores.servicios)}</span>
            </div>
            <div className="resumen-item">
              <span>Impuestos:</span>
              <span>{formatCurrency(valores.impuestos)}</span>
            </div>
            <div className="resumen-item resumen-total">
              <span>TOTAL:</span>
              <span>{formatCurrency(calcularTotal())}</span>
            </div>
          </div>

          {/* Plan de pago */}
          <div className="field">
            <label htmlFor="planPago">
              <i className="fas fa-calendar-alt"></i> Plan de pago <span>(obligatorio)</span>
            </label>
            <select 
              id="planPago" 
              name="planPago"
              value={formData.planPago}
              onChange={handlePlanPagoChange}
              required
            >
              <option value="" disabled>Selecciona una opción</option>
              <option value="completo">Pago completo (5% descuento)</option>
              <option value="inicial">Pago inicial (50%)</option>
            </select>
          </div>

          {/* Total a pagar */}
          <div className="field">
            <label htmlFor="totalPagar">
              <i className="fas fa-money-bill-wave"></i> TOTAL A PAGAR
            </label>
            <input 
              type="text" 
              id="totalPagar" 
              value={formatCurrency(totalPagar)} 
              readOnly 
            />
          </div>

          {/* Opciones de pago */}
          <div className="field">
            <label>
              <i className="fas fa-credit-card"></i> Método de Pago <span>(obligatorio)</span>
            </label>
            <div className="payment-options">
              <button 
                type="button" 
                className={formData.metodoPago === 'efectivo' ? 'active' : ''}
                onClick={() => handleMetodoPagoChange('efectivo')}
              >
                <i className="fas fa-money-bill"></i> Efectivo
              </button>
              <button 
                type="button" 
                className={formData.metodoPago === 'debito' ? 'active' : ''}
                onClick={() => handleMetodoPagoChange('debito')}
              >
                <i className="fas fa-credit-card"></i> Débito
              </button>
              <button 
                type="button" 
                className={formData.metodoPago === 'credito' ? 'active' : ''}
                onClick={() => handleMetodoPagoChange('credito')}
              >
                <i className="fas fa-credit-card"></i> Crédito
              </button>
              <button 
                type="button" 
                className={formData.metodoPago === 'transferencia' ? 'active' : ''}
                onClick={() => handleMetodoPagoChange('transferencia')}
              >
                <i className="fas fa-university"></i> Transferencia
              </button>
            </div>
          </div>

          {/* Vista previa de tarjeta (solo mostrar para crédito/débito) */}
          {(formData.metodoPago === 'credito' || formData.metodoPago === 'debito') && (
            <>
              <div className="card-preview">
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/196/196578.png" 
                  alt="Chip" 
                  className="card-chip" 
                />
                <div className="card-number">{getCardNumberPreview()}</div>
                <div className="card-details">
                  <div className="card-name">{getCardNamePreview()}</div>
                  <div className="card-expiry">{getCardExpiryPreview()}</div>
                </div>
              </div>

              {/* Datos de tarjeta */}
              <div className="field">
                <label htmlFor="nombreTitular">
                  <i className="fas fa-user"></i> Nombre del Titular <span>(obligatorio)</span>
                </label>
                <input 
                  type="text" 
                  id="nombreTitular" 
                  name="nombreTitular"
                  value={formData.nombreTitular}
                  onChange={handleInputChange}
                  required={formData.metodoPago === 'credito' || formData.metodoPago === 'debito'}
                />
              </div>

              <div className="field">
                <label htmlFor="numeroTarjeta">
                  <i className="fas fa-credit-card"></i> Número de Tarjeta <span>(obligatorio)</span>
                </label>
                <input 
                  type="text" 
                  id="numeroTarjeta" 
                  name="numeroTarjeta"
                  value={formData.numeroTarjeta}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  required={formData.metodoPago === 'credito' || formData.metodoPago === 'debito'}
                />
              </div>

              <div className="field group-3">
                <div className="field">
                  <label htmlFor="fechaExpiracion">
                    <i className="fas fa-calendar"></i> Fecha Exp. <span>(obligatorio)</span>
                  </label>
                  <input 
                    type="text" 
                    id="fechaExpiracion" 
                    name="fechaExpiracion"
                    value={formData.fechaExpiracion}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    required={formData.metodoPago === 'credito' || formData.metodoPago === 'debito'}
                  />
                </div>
                <div className="field">
                  <label htmlFor="cvv">
                    <i className="fas fa-lock"></i> CVV <span>(obligatorio)</span>
                  </label>
                  <input 
                    type="text" 
                    id="cvv" 
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    required={formData.metodoPago === 'credito' || formData.metodoPago === 'debito'}
                  />
                </div>
                <div className="field">
                  <label htmlFor="tipoDocumento">
                    <i className="fas fa-id-card"></i> Tipo Doc. <span>(obligatorio)</span>
                  </label>
                  <select 
                    id="tipoDocumento" 
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleInputChange}
                    required={formData.metodoPago === 'credito' || formData.metodoPago === 'debito'}
                  >
                    <option value="cc">C.C.</option>
                    <option value="ce">C.E.</option>
                    <option value="pasaporte">Pasaporte</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Dirección */}
          <div className="field">
            <label htmlFor="pais">
              <i className="fas fa-map-marker-alt"></i> Dirección <span>(obligatorio)</span>
            </label>
            <select 
              id="pais" 
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              required
            >
              <option value="colombia">Colombia</option>
              <option value="mexico">México</option>
              <option value="chile">Chile</option>
            </select>
            <input 
              type="text" 
              id="direccion1" 
              name="direccion1"
              value={formData.direccion1}
              onChange={handleInputChange}
              placeholder="Dirección línea 1"
              required
            />
            <input 
              type="text" 
              id="direccion2" 
              name="direccion2"
              value={formData.direccion2}
              onChange={handleInputChange}
              placeholder="Dirección línea 2 (opcional)"
            />
          </div>

          <div className="field group-3">
            <div className="field">
              <label htmlFor="ciudad">
                <i className="fas fa-city"></i> Ciudad <span>(obligatorio)</span>
              </label>
              <input 
                type="text" 
                id="ciudad" 
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="departamento">
                <i className="fas fa-building"></i> Departamento <span>(obligatorio)</span>
              </label>
              <input 
                type="text" 
                id="departamento" 
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="codigoPostal">
                <i className="fas fa-mail-bulk"></i> Código Postal
              </label>
              <input 
                type="text" 
                id="codigoPostal" 
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="field" style={{ marginTop: '2rem' }}>
            <label style={{ fontWeight: 'normal' }}>
              <input 
                type="checkbox" 
                id="terminos" 
                name="terminos"
                checked={formData.terminos}
                onChange={handleInputChange}
                required 
                style={{ marginRight: '0.5rem' }}
              />
              Acepto los <a href="#" style={{ color: 'var(--primary)' }}>Términos y Condiciones</a> y la <a href="#" style={{ color: 'var(--primary)' }}>Política de Privacidad</a>
            </label>
          </div>

          <button type="submit" className="btn-pagar">
            <i className="fas fa-lock"></i> Confirmar Pago
          </button>
        </form>

        <section className="image-section">
          <div className="image-decoration decoration-1"></div>
          <div className="image-decoration decoration-2"></div>
          <img src="./Fotos/Imagenes/3.4.jpg" alt="Evento de lujo" />
        </section>
      </main>
    </div>
  );
};

export default MetodoPago;