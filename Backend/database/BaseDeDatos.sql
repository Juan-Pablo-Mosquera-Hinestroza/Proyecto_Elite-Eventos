-- ================================================
-- BASE DE DATOS: Elite_Eventos (Limpia y Optimizada)
-- ================================================

DROP DATABASE IF EXISTS Elite_Eventos;
CREATE DATABASE Elite_Eventos CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE Elite_Eventos;

-- ================================================
-- TABLA: Usuario
-- ================================================
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    password VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Cliente', 'Empleado') DEFAULT 'Cliente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- ================================================
-- TABLA: Salon (Haciendas)
-- ================================================
CREATE TABLE Salon (
    id_salon INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    capacidad INT NOT NULL,
    descripcion VARCHAR(300),
    precio_base DECIMAL(10,2),
    imagen_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: Decoracion
-- ================================================
CREATE TABLE Decoracion (
    id_decoracion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(300),
    precio DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: Servicio_ad
-- ================================================
CREATE TABLE Servicio_ad (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(300),
    precio DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ================================================
-- TABLA: Evento (Sistema completo de eventos)
-- ================================================
CREATE TABLE Evento (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_salon INT NOT NULL,
    id_decoracion INT,
    
    -- Detalles del evento
    fecha_evento DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME,
    numero_invitados INT NOT NULL CHECK (numero_invitados > 0),
    tipo_evento VARCHAR(100),
    tematica VARCHAR(100),
    descripcion TEXT,
    
    -- Precios desglosados
    precio_hacienda DECIMAL(10,2) NOT NULL,
    precio_decoracion DECIMAL(10,2) DEFAULT 0,
    precio_servicios DECIMAL(10,2) DEFAULT 0,
    descuento DECIMAL(5,2) DEFAULT 0,
    precio_total DECIMAL(10,2) NOT NULL,
    
    -- Estado y pago
    estado ENUM('Pendiente', 'Confirmado', 'Cancelado', 'Completado') DEFAULT 'Pendiente',
    metodo_pago VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_salon) REFERENCES Salon(id_salon) ON DELETE RESTRICT,
    FOREIGN KEY (id_decoracion) REFERENCES Decoracion(id_decoracion) ON DELETE SET NULL,
    
    INDEX idx_fecha (fecha_evento),
    INDEX idx_estado (estado),
    INDEX idx_usuario (id_usuario),
    
    -- Evitar que una hacienda tenga dos eventos el mismo día/hora
    UNIQUE KEY unique_salon_fecha_hora (id_salon, fecha_evento, hora_inicio)
);

-- ================================================
-- TABLA: Evento_Servicio (Relación M:N)
-- ================================================
CREATE TABLE Evento_Servicio (
    id_evento_servicio INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT DEFAULT 1 CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_evento) REFERENCES Evento(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES Servicio_ad(id_servicio) ON DELETE RESTRICT,
    UNIQUE KEY unique_evento_servicio (id_evento, id_servicio)
);

-- ================================================
-- DATOS INICIALES: Usuarios
-- ================================================
INSERT INTO Usuario (nombre, email, telefono, direccion, password, rol) VALUES
('Admin Principal', 'admin@eliteventos.com', '3001234567', 'Cali, Valle', '$2a$10$adminhashdemo', 'Admin'),
('Juan Pérez', 'juan@example.com', '3009876543', 'Cali, Valle', '$2a$10$juanhashdemo', 'Cliente'),
('María González', 'maria@example.com', '3007654321', 'Palmira, Valle', '$2a$10$mariahashdemo', 'Cliente'),
('Carlos Rodríguez', 'carlos@example.com', '3001112233', 'Jamundí, Valle', '$2a$10$carloshashdemo', 'Cliente');

-- ================================================
-- DATOS INICIALES: Haciendas (Salones)
-- ================================================
INSERT INTO Salon (nombre, direccion, capacidad, descripcion, precio_base, imagen_url) VALUES
('Hacienda El Paraíso', 'Km 5 Vía Cali-Palmira', 200, 'Hermosa hacienda colonial con amplios jardines', 2500000, '/hacienda1.jpg'),
('Hacienda La Cascada', 'Vereda El Carmen', 150, 'Rodeada de naturaleza con cascadas', 2000000, '/hacienda2.jpg'),
('Hacienda Vista Hermosa', 'Km 8 Vía Jamundí', 180, 'Vista panorámica de las montañas', 2200000, '/hacienda3.jpg'),
('Hacienda San José', 'Vereda La María', 250, 'La más grande con zona de camping', 3000000, '/hacienda4.jpg');

-- ================================================
-- DATOS INICIALES: Decoraciones
-- ================================================
INSERT INTO Decoracion (nombre, descripcion, precio) VALUES
('Rústico', 'Decoración estilo campestre con madera y flores', 800000),
('Clásico', 'Elegancia tradicional con tonos neutros', 900000),
('Moderno', 'Diseño contemporáneo minimalista', 1000000),
('Tropical', 'Colores vibrantes y vegetación exótica', 850000),
('Vintage', 'Estilo retro con muebles antiguos', 950000),
('Minimalista', 'Sencillez y espacios despejados', 750000),
('Bohemio', 'Estilo libre con texturas naturales', 880000),
('Industrial', 'Estilo urbano con metales y concreto', 920000);

-- ================================================
-- DATOS INICIALES: Servicios
-- ================================================
INSERT INTO Servicio_ad (nombre, descripcion, precio) VALUES
('Música en Vivo', 'Banda o DJ profesional', 1500000),
('Catering Buffet', 'Servicio de comida tipo buffet (por persona)', 80000),
('Catering Mesa', 'Servicio a la mesa (por persona)', 120000),
('Bebidas Premium', 'Barra libre con licores (por persona)', 50000);

-- ================================================
-- DATOS DE PRUEBA: Eventos
-- ================================================
INSERT INTO Evento (id_usuario, id_salon, id_decoracion, fecha_evento, hora_inicio, hora_fin, numero_invitados, tipo_evento, tematica, descripcion, precio_hacienda, precio_decoracion, precio_servicios, precio_total, estado, metodo_pago) VALUES
(2, 1, 1, '2025-12-15', '14:00:00', '22:00:00', 150, 'Boda', 'Rústico', 'Boda Juan y Ana', 2500000, 800000, 13500000, 16800000, 'Confirmado', 'Transferencia'),
(3, 2, 3, '2025-12-20', '10:00:00', '18:00:00', 100, 'Cumpleaños', 'Moderno', 'Cumpleaños 50 años María', 2000000, 1000000, 17000000, 20000000, 'Pendiente', NULL),
(4, 3, 5, '2026-01-10', '16:00:00', '23:00:00', 120, 'Aniversario', 'Vintage', 'Aniversario empresa TechCorp', 2200000, 950000, 0, 3150000, 'Pendiente', NULL);

-- ================================================
-- DATOS DE PRUEBA: Servicios en eventos
-- ================================================
INSERT INTO Evento_Servicio (id_evento, id_servicio, cantidad, precio_unitario, subtotal) VALUES
-- Evento 1 (Boda Juan y Ana)
(1, 1, 1, 1500000, 1500000),   -- Música en vivo
(1, 2, 150, 80000, 12000000),  -- Catering Buffet para 150 personas

-- Evento 2 (Cumpleaños María)
(2, 3, 100, 120000, 12000000), -- Catering Mesa para 100 personas
(2, 4, 100, 50000, 5000000);   -- Bebidas Premium para 100 personas

-- ================================================
-- VERIFICAR DATOS
-- ================================================
SELECT '=== RESUMEN DE DATOS ===' as '';
SELECT 'Usuarios:' as Tabla, COUNT(*) as Total FROM Usuario
UNION ALL SELECT 'Haciendas:', COUNT(*) FROM Salon
UNION ALL SELECT 'Decoraciones:', COUNT(*) FROM Decoracion
UNION ALL SELECT 'Servicios:', COUNT(*) FROM Servicio_ad
UNION ALL SELECT 'Eventos:', COUNT(*) FROM Evento
UNION ALL SELECT 'Evento_Servicios:', COUNT(*) FROM Evento_Servicio;