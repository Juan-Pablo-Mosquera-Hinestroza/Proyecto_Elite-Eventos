import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReserva } from '../../contexts/ReservaContext';
import eventosAPI from '../../api/eventosAPI'; // ✅ 1. AGREGAR IMPORT
import 'bootstrap/dist/css/bootstrap.min.css';
import './Metodo.css';

const MetodoPago = () => {
  const navigate = useNavigate();
  const { reservaData, updateReserva, resetReserva } = useReserva();
  const [loading, setLoading] = useState(false);

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
    hacienda: reservaData.precio_hacienda || 0,
    decoracion: reservaData.precio_decoracion || 0,
    servicios: reservaData.precio_servicios || 0,
    impuestos: 0
  });

  const [totalPagar, setTotalPagar] = useState(0);
  const [descuentoAplicado, setDescuentoAplicado] = useState(0);
  const [porcentajeDescuento, setPorcentajeDescuento] = useState(0);

  // ✅ Debug inicial
  useEffect(() => {
    console.log('🔍 ========== DEBUG METODO.JSX ==========');
    console.log('📦 reservaData completo:', reservaData);
    console.log('💰 precio_hacienda:', reservaData.precio_hacienda, typeof reservaData.precio_hacienda);
    console.log('🎨 precio_decoracion:', reservaData.precio_decoracion, typeof reservaData.precio_decoracion);
    console.log('⚙️ precio_servicios:', reservaData.precio_servicios, typeof reservaData.precio_servicios);
    console.log('📊 Valores cargados:', valores);
    console.log('💳 Plan de pago:', formData.planPago);
    console.log('💵 Total a pagar:', totalPagar);
    console.log('🎁 Descuento aplicado:', descuentoAplicado);
    console.log('📊 Porcentaje descuento:', porcentajeDescuento + '%');
    console.log('🔍 ======================================');
  }, [reservaData, valores, totalPagar, descuentoAplicado, porcentajeDescuento]);

  // ✅ Calcular impuestos
  useEffect(() => {
    const subtotal = valores.hacienda + valores.decoracion + valores.servicios;
    const impuestos = subtotal * 0.19;

    setValores(prev => ({
      ...prev,
      impuestos
    }));

    console.log('🧮 Cálculo de impuestos:', {
      hacienda: valores.hacienda,
      decoracion: valores.decoracion,
      servicios: valores.servicios,
      subtotal,
      impuestos
    });
  }, [valores.hacienda, valores.decoracion, valores.servicios]);

  // ✅ 3. Calcular total a pagar según plan de pago (DESCUENTOS CORREGIDOS)
  useEffect(() => {
    const subtotal = valores.hacienda + valores.decoracion + valores.servicios;
    const impuestos = subtotal * 0.19;
    const totalBase = subtotal + impuestos;
    let total = totalBase;
    let descuento = 0;
    let porcentaje = 0;

    if (formData.planPago === 'completo') {
      // ✅ Pago completo: 10% de descuento
      porcentaje = 10;
      descuento = totalBase * 0.10;
      total = totalBase - descuento;

      console.log('✅ Pago Completo (10% descuento):', {
        total_base: totalBase,
        descuento,
        total_final: total
      });
    } else if (formData.planPago === 'inicial') {
      // ✅ Pago inicial: 5% de descuento + 50% del total
      porcentaje = 5;
      descuento = totalBase * 0.05;
      const totalConDescuento = totalBase - descuento;
      total = totalConDescuento * 0.5; // Pagar 50%

      console.log('✅ Pago Inicial (5% descuento + 50%):', {
        total_base: totalBase,
        descuento,
        total_con_descuento: totalConDescuento,
        pago_inicial_50: total,
        restante: totalConDescuento - total
      });
    }

    setTotalPagar(total);
    setDescuentoAplicado(descuento);
    setPorcentajeDescuento(porcentaje);

    console.log('🎯 Total final a pagar:', total);
  }, [valores.hacienda, valores.decoracion, valores.servicios, valores.impuestos, formData.planPago]);

  // ✅ Calcular el total completo con descuento
  const calcularTotalCompleto = () => {
    const subtotal = valores.hacienda + valores.decoracion + valores.servicios;
    const impuestos = subtotal * 0.19;
    const totalBase = subtotal + impuestos;

    if (formData.planPago === 'completo') {
      return totalBase - (totalBase * 0.10); // 10% descuento
    } else if (formData.planPago === 'inicial') {
      return totalBase - (totalBase * 0.05); // 5% descuento (total completo, no solo el inicial)
    }

    return totalBase;
  };

  const calcularTotal = () => {
    return valores.hacienda + valores.decoracion + valores.servicios + valores.impuestos;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMetodoPagoChange = (metodo) => {
    setFormData(prevState => ({
      ...prevState,
      metodoPago: metodo
    }));
  };

  const handlePlanPagoChange = (e) => {
    const plan = e.target.value;
    setFormData(prevState => ({
      ...prevState,
      planPago: plan
    }));
  };

  // ✅ 2. Manejar envío del formulario (CORREGIR id_usuario)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.planPago) {
      alert('Por favor, selecciona un plan de pago.');
      return;
    }

    if (!formData.metodoPago) {
      alert('Por favor, selecciona un método de pago.');
      return;
    }

    if (!formData.terminos) {
      alert('Debes aceptar los términos y condiciones.');
      return;
    }

    setLoading(true);

    try {
      // ✅ 2. OBTENER id_usuario CORRECTAMENTE
      let userId = reservaData.id_usuario;

      // Si no está en reservaData, buscar en localStorage
      if (!userId || isNaN(userId)) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userId = user.id_usuario;
            console.log('🔍 userId desde localStorage:', userId);
          } catch (parseError) {
            console.error('❌ Error al parsear user de localStorage:', parseError);
          }
        }
      }

      // Validar que userId sea un número válido
      if (!userId || isNaN(userId)) {
        console.error('❌ userId inválido:', userId);
        alert('⚠️ No se pudo identificar el usuario. Por favor, inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      console.log('✅ userId válido:', userId, typeof userId);

      // ✅ Calcular valores finales
      const subtotal = valores.hacienda + valores.decoracion + valores.servicios;
      const impuestos = subtotal * 0.19;
      const totalBase = subtotal + impuestos;

      let descuento = 0;
      let totalConDescuento = totalBase;

      if (formData.planPago === 'completo') {
        descuento = totalBase * 0.10; // 10% descuento
        totalConDescuento = totalBase - descuento;
      } else if (formData.planPago === 'inicial') {
        descuento = totalBase * 0.05; // 5% descuento
        totalConDescuento = totalBase - descuento;
      }

      // Mapear servicios
      const servicios = (reservaData.servicios || []).map(servicio => ({
        id_servicio: servicio.id_servicio,
        cantidad: servicio.cantidad || 1,
        precio_unitario: servicio.precio_unitario,
        subtotal: servicio.subtotal || servicio.precio_unitario
      }));

      // ✅ Construir objeto del evento
      const eventoData = {
        id_usuario: parseInt(userId),
        id_salon: reservaData.id_salon,
        id_decoracion: reservaData.id_decoracion,
        fecha_evento: reservaData.fecha_evento,
        hora_inicio: reservaData.hora_inicio,
        hora_fin: reservaData.hora_fin,
        numero_invitados: parseInt(reservaData.numero_invitados),
        tipo_evento: reservaData.tipo_evento,
        tematica: reservaData.tematica || '',
        descripcion: reservaData.descripcion || reservaData.observaciones || '',
        precio_hacienda: valores.hacienda,
        precio_decoracion: valores.decoracion,
        precio_servicios: valores.servicios,
        descuento: descuento,
        precio_total: totalConDescuento,
        metodo_pago: formData.metodoPago,
        servicios: servicios,
        plan_pago: formData.planPago,
        monto_pagado: totalPagar
      };

      console.log('📤 ========== ENVIANDO AL BACKEND ==========');
      console.log('📊 Desglose de precios:');
      console.log('  💰 Hacienda:', valores.hacienda);
      console.log('  🎨 Decoración:', valores.decoracion);
      console.log('  ⚙️ Servicios:', valores.servicios);
      console.log('  📊 Subtotal:', subtotal);
      console.log('  💵 Impuestos (19%):', impuestos);
      console.log('  💰 Total base:', totalBase);
      console.log('  🎁 Descuento (' + porcentajeDescuento + '%):', descuento);
      console.log('  💳 Total con descuento:', totalConDescuento);
      console.log('  📅 Plan de pago:', formData.planPago);
      console.log('  💸 Monto a pagar ahora:', totalPagar);
      console.log('📦 Evento completo:', eventoData);
      console.log('🔍 ==========================================');

      // ✅ CORREGIR: Usar .create en lugar de .createEvento
      const response = await eventosAPI.create(eventoData);

      if (response.data.success) {
        console.log('✅ Evento creado exitosamente:', response.data);

        let mensaje = `✅ ¡Reserva realizada con éxito!\n\n`;
        mensaje += `ID del Evento: ${response.data.data.id_evento}\n`;
        mensaje += `Plan: ${formData.planPago === 'completo' ? 'Pago Completo (10% desc.)' : 'Pago Inicial (5% desc.)'}\n`;
        mensaje += `Monto pagado ahora: ${formatCurrency(totalPagar)}\n`;

        if (formData.planPago === 'inicial') {
          mensaje += `Restante a pagar: ${formatCurrency(totalConDescuento - totalPagar)}`;
        }

        alert(mensaje);

        resetReserva();
        navigate('/haciendas');
      } else {
        throw new Error(response.data.message || 'Error al crear el evento');
      }
    } catch (error) {
      console.error('❌ Error creando evento:', error);
      console.error('📦 Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      alert(error.response?.data?.message || 'Error al procesar la reserva. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const getCardNumberPreview = () => {
    if (!formData.numeroTarjeta) return '•••• •••• •••• 4242';
    return formData.numeroTarjeta;
  };

  const getCardNamePreview = () => {
    if (!formData.nombreTitular) return 'NOMBRE TITULAR';
    return formData.nombreTitular.toUpperCase();
  };

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

          {/* ✅ Resumen mejorado con descuentos dinámicos */}
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
              <span>Subtotal:</span>
              <span>{formatCurrency(valores.hacienda + valores.decoracion + valores.servicios)}</span>
            </div>
            <div className="resumen-item">
              <span>Impuestos (19%):</span>
              <span>{formatCurrency(valores.impuestos)}</span>
            </div>

            {/* ✅ Mostrar descuento según plan */}
            {formData.planPago && descuentoAplicado > 0 && (
              <div className="resumen-item" style={{ color: '#28a745', fontWeight: 'bold' }}>
                <span>🎁 Descuento ({porcentajeDescuento}%):</span>
                <span>- {formatCurrency(descuentoAplicado)}</span>
              </div>
            )}

            <div className="resumen-item resumen-total">
              <span>TOTAL CON DESCUENTO:</span>
              <span>{formatCurrency(calcularTotalCompleto())}</span>
            </div>

            {/* ✅ Mostrar pago inicial si aplica */}
            {formData.planPago === 'inicial' && (
              <div className="alert alert-info mt-3" style={{
                background: '#e3f2fd',
                border: '1px solid #2196f3',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <i className="fas fa-info-circle me-2"></i>
                <strong>📌 Pago Inicial (50%):</strong> {formatCurrency(totalPagar)}
                <br />
                <small><strong>Restante a pagar después:</strong> {formatCurrency(calcularTotalCompleto() - totalPagar)}</small>
              </div>
            )}

            {/* ✅ Mostrar mensaje de descuento para pago completo */}
            {formData.planPago === 'completo' && (
              <div className="alert alert-success mt-3" style={{
                background: '#d4edda',
                border: '1px solid #28a745',
                borderRadius: '8px',
                padding: '1rem'
              }}>
                <i className="fas fa-check-circle me-2"></i>
                <strong>🎉 ¡Ahorras {formatCurrency(descuentoAplicado)} pagando completo!</strong>
              </div>
            )}
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
              <option value="completo">💰 Pago completo (10% descuento)</option>
              <option value="inicial">📅 Pago inicial 50% (5% descuento)</option>
            </select>
          </div>

          {/* Total a pagar */}
          <div className="field">
            <label htmlFor="totalPagar">
              <i className="fas fa-money-bill-wave"></i> TOTAL A PAGAR AHORA
            </label>
            <input
              type="text"
              id="totalPagar"
              value={formatCurrency(totalPagar)}
              readOnly
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: formData.planPago === 'completo' ? '#28a745' : '#2196f3',
                background: formData.planPago ? '#f0f8ff' : '#fff'
              }}
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

          <button type="submit" className="btn-pagar" disabled={loading || !formData.planPago}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Procesando...
              </>
            ) : (
              <>
                <i className="fas fa-lock"></i> Confirmar Pago de {formatCurrency(totalPagar)}
              </>
            )}
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