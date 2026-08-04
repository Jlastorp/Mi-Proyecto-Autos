import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = "postgresql://postgres:VkAMRGQpmDshBIdCZuEDXUQlDapKQSkg@sakura.proxy.rlwy.net:51751/railway";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const sqlScript = `


CREATE TABLE IF NOT EXISTS marcas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS modelos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  marca_id INT NOT NULL,
  CONSTRAINT fk_marca FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS vendedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  ubicacion VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS compradores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS autos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  precio NUMERIC(10, 2) NOT NULL,
  color VARCHAR(30) NOT NULL,
  year INT NOT NULL,
  imagen_url TEXT,
  descripcion TEXT,
  modelo_id INT NOT NULL,
  vendedor_id INT NOT NULL,
  CONSTRAINT fk_modelo FOREIGN KEY (modelo_id) REFERENCES modelos(id),
  CONSTRAINT fk_vendedor FOREIGN KEY (vendedor_id) REFERENCES vendedores(id)
);

CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  auto_id INT UNIQUE NOT NULL,
  comprador_id INT NOT NULL,
  fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_auto FOREIGN KEY (auto_id) REFERENCES autos(id),
  CONSTRAINT fk_comprador FOREIGN KEY (comprador_id) REFERENCES compradores(id)
);



-- Marcas
INSERT INTO marcas (id, nombre) VALUES 
  (1, 'Toyota'), 
  (2, 'Honda'), 
  (3, 'Mazda'), 
  (4, 'Mitsubishi'), 
  (5, 'Hyundai')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- Modelos
INSERT INTO modelos (id, nombre, marca_id) VALUES 
  (1, 'Hilux', 1),
  (2, 'RAV4', 1),
  (3, 'Yaris Sedan', 1),
  (4, 'Civic', 2),
  (5, 'CR-V', 2),
  (6, 'Mazda 3', 3),
  (7, 'CX-5', 3),
  (8, 'Outlander', 4),
  (9, 'Tucson', 5)
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, marca_id = EXCLUDED.marca_id;

-- Vendedores
INSERT INTO vendedores (id, nombre, telefono, ubicacion) VALUES 
  (1, 'AutoVentas El Obelisco', '2334-8890', 'Zona 10, Ciudad de Guatemala'),
  (2, 'Predio San Cristóbal', '5412-9900', 'Bulevar San Cristóbal, Mixco'),
  (3, 'Importadora Roosevelth', '5511-2233', 'Calzada Roosevelt, Zona 11'),
  (4, 'Vehículos de Occidente', '7761-4455', 'Quetzaltenango (Xela)')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, telefono = EXCLUDED.telefono, ubicacion = EXCLUDED.ubicacion;

-- Compradores
INSERT INTO compradores (id, nombre, email) VALUES 
  (1, 'Juan Pablo Asturias', 'jp.asturias@gmail.com'),
  (2, 'María Fernanda Morales', 'mafer.morales@hotmail.com')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre, email = EXCLUDED.email;

-- Reiniciar e Insertar Catálogo de Autos
TRUNCATE TABLE autos RESTART IDENTITY CASCADE;

INSERT INTO autos (titulo, precio, color, year, imagen_url, descripcion, modelo_id, vendedor_id) VALUES 
  ('Toyota Hilux SR5 3.0 Turbo Diésel 4x4', 185000.00, 'Blanco', 2018, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600', 'Nacional de agencia, único dueño, 4x4, duraliner y barra antivuelco.', 1, 1),
  ('Toyota RAV4 LE Full Equipo', 145000.00, 'Gris Policromado', 2019, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600', 'Impecable, recién importada, aros de lujo, cámara de retroceso.', 2, 3),
  ('Toyota Yaris Sedan Mecánico', 68000.00, 'Rojo', 2017, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600', 'Súper económico, motor 1.5cc, aire acondicionado al 100%, nitidísimo.', 3, 2),
  ('Honda Civic EX Turbo', 98000.00, 'Negro Azabache', 2018, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600', 'Sunroof, encendido de botón, pantalla touch con Apple CarPlay, bolsas intactas.', 4, 3),
  ('Honda CR-V Touring Leather', 138000.00, 'Blanco Perla', 2017, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600', 'Cojinería de cuero, baúl eléctrico, tracción AWD, servicio recién hecho.', 5, 1),
  ('Mazda 3 Hatchback Touring', 85000.00, 'Rojo', 2019, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600', 'Línea nueva, sistema Skyactiv, mandos al timón, aros rin 18 originales.', 6, 4),
  ('Mazda CX-5 Grand Touring AWD', 125000.00, 'Azul Marino', 2018, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600', 'Sonido Bose, cuero de agencia, sensor de punto ciego y luces LED.', 7, 4),
  ('Mitsubishi Outlander Sport Limited', 72000.00, 'Plateado', 2016, 'https://i.pinimg.com/originals/59/03/9d/59039d144a81e457cc2de2b47aaca20a.jpg', '3 filas de asientos, barras de techo, económica de combustible.', 8, 2);
`;

async function crearTablas() {
  try {
    console.log(' Conectando a la base de datos de Railway...');
    await pool.query(sqlScript);
    console.log(' ¡Tablas y catálogo cargados correctamente!');
  } catch (err) {
    console.error(' Error al crear la base de datos:', err);
  } finally {
    await pool.end();
  }
}

crearTablas();