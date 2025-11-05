-- ================================================
-- BASE DE DATOS: Elite_Eventos (Mejorada)
-- ================================================

DROP DATABASE IF EXISTS EliteEventos;
CREATE DATABASE Elite_Eventos CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE Elite_Eventos;

-- ================================================
-- TABLA: Usuario
-- ================================================
CREATE TABLE Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
-- TABLA: Reserva
-- ================================================
CREATE TABLE Reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_salon INT NOT NULL,
    fecha_reser DATE NOT NULL,
    fecha_evento DATE NOT NULL,
    tipo_evento VARCHAR(100) NOT NULL,
    tematica VARCHAR(100),
    institucion VARCHAR(100),
    num_invitados INT,
    musica_vivo BOOLEAN DEFAULT FALSE,
    tipo_comida VARCHAR(50),
    bebidas_alcoholicas BOOLEAN DEFAULT FALSE,
    presupuesto_min DECIMAL(10,2),
    presupuesto_max DECIMAL(10,2),
    metodo_pago VARCHAR(50),
    total DECIMAL(10,2),
    estado VARCHAR(50) DEFAULT 'Pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_salon) REFERENCES Salon(id_salon)
);

-- ================================================
-- TABLAS INTERMEDIAS
-- ================================================
CREATE TABLE Reserva_Decoracion (
    id_reserva INT NOT NULL,
    id_decoracion INT NOT NULL,
    PRIMARY KEY (id_reserva, id_decoracion),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_decoracion) REFERENCES Decoracion(id_decoracion)
);

CREATE TABLE Reserva_Servicio (
    id_reserva INT NOT NULL,
    id_servicio INT NOT NULL,
    PRIMARY KEY (id_reserva, id_servicio),
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES Servicio_ad(id_servicio)
);

-- ================================================
-- TABLA: Factura
-- ================================================
CREATE TABLE Factura (
    id_factura INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    fecha_pago DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reserva) REFERENCES Reserva(id_reserva)
);

-- ================================================
-- TABLA: Direccion_Usuario
-- ================================================
CREATE TABLE Direccion_Usuario (
    id_direccion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    pais VARCHAR(100),
    departamento VARCHAR(100),
    ciudad VARCHAR(100),
    direccion VARCHAR(200),
    codigo_postal VARCHAR(20),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- ================================================
-- DATOS INICIALES: Haciendas
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



-- Crear usuario para la aplicación
CREATE USER 'elite_admin'@'localhost' IDENTIFIED BY 'elite_password_2024';

-- Dar permisos a la base de datos EliteEventos
GRANT ALL PRIVILEGES ON EliteEventos.* TO 'elite_admin'@'localhost';
FLUSH PRIVILEGES;