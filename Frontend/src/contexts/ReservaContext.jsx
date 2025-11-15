import React, { createContext, useState, useContext } from 'react';

const ReservaContext = createContext();

export const useReserva = () => {
    const context = useContext(ReservaContext);
    if (!context) {
        throw new Error('useReserva debe usarse dentro de ReservaProvider');
    }
    return context;
};

export const ReservaProvider = ({ children }) => {
    const [reservaData, setReservaData] = useState({
        // Paso 1: Fecha y hacienda (Opciones.jsx)
        fecha_evento: null,
        hora_inicio: '',
        hora_fin: '',
        id_salon: null,
        haciendaNombre: '',

        // Paso 2: Info personal (Opciones.jsx)
        nombre: '',
        apellidos: '',
        telefono: '',
        email: '',
        empresa: '',

        // Paso 3: Detalles del evento (Opciones.jsx)
        tipo_evento: '',
        tematica: '',
        duracion: '',

        // Paso 4: Decoración (Decoraciones.jsx)
        id_decoracion: null,
        decoracionNombre: '',
        precio_decoracion: 0,

        // Paso 5: Servicios (Decoraciones.jsx)
        servicios: [], // Array: [{ id_servicio, cantidad, precio }]
        precio_servicios: 0,

        // Paso 6: Resumen (Factura.jsx)
        numero_invitados: 0,
        ubicacion: '',
        observaciones: '',

        // Paso 7: Pago (Metodo.jsx)
        metodo_pago: '',

        // Precios
        precio_hacienda: 0,
        precio_total: 0
    });

    const updateReserva = (newData) => {
        setReservaData(prev => ({ ...prev, ...newData }));
    };

    const resetReserva = () => {
        setReservaData({
            fecha_evento: null,
            hora_inicio: '',
            hora_fin: '',
            id_salon: null,
            haciendaNombre: '',
            nombre: '',
            apellidos: '',
            telefono: '',
            email: '',
            empresa: '',
            tipo_evento: '',
            tematica: '',
            duracion: '',
            id_decoracion: null,
            decoracionNombre: '',
            precio_decoracion: 0,
            servicios: [],
            precio_servicios: 0,
            numero_invitados: 0,
            ubicacion: '',
            observaciones: '',
            metodo_pago: '',
            precio_hacienda: 0,
            precio_total: 0
        });
    };

    return (
        <ReservaContext.Provider value={{ reservaData, updateReserva, resetReserva }}>
            {children}
        </ReservaContext.Provider>
    );
};