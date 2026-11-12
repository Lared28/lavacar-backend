-- Creación de la tabla principal para el sistema Lavacar Apex Detailing
CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  tipo_vehiculo VARCHAR(50) NOT NULL DEFAULT 'Todos',
  precio DECIMAL(10, 2) NOT NULL,
  duracion_minutos INT NOT NULL DEFAULT 30,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registros iniciales de prueba
INSERT INTO servicios (nombre, descripcion, tipo_vehiculo, precio, duracion_minutos) VALUES
('Lavado Express Exterior', 'Lavado de carrocería con shampoo pH neutro, limpieza de aros y brillo de llantas.', 'Sedán', 8000.00, 30),
('Lavado Completo Interior y Exterior', 'Lavado exterior, aspirado profundo de alfombras y asientos, limpieza de tablero y vidrios.', 'Todos', 14000.00, 60),
('Detailing SUV / 4x4 Premium', 'Lavado profundo de chasis, descontaminado de pintura, encerado sintético e hidratación de plásticos.', 'SUV / 4x4', 28000.00, 120),
('Lavado Moto Detallado', 'Limpieza cuidadosa de carenado, desengrase de cadena y protección de partes metálicas.', 'Motocicleta', 6000.00, 35);