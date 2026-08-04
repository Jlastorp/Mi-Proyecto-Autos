import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = "postgresql://postgres:VkAMRGQpmDshBIdCZuEDXUQlDapKQSkg@sakura.proxy.rlwy.net:51751/railway";

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const sqlScript = `
-- 1. Crear Tabla Marcas
CREATE TABLE IF NOT EXISTS marcas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Crear Tabla Modelos
CREATE TABLE IF NOT EXISTS modelos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  marca_id INT NOT NULL,
  CONSTRAINT fk_marca FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE CASCADE
);

-- 3. Crear Tabla Vendedores
CREATE TABLE IF NOT EXISTS vendedores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  ubicacion VARCHAR(100)
);

-- 4. Crear Tabla Compradores
CREATE TABLE IF NOT EXISTS compradores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- 5. Crear Tabla Autos
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

-- 6. Crear Tabla Ventas
CREATE TABLE IF NOT EXISTS ventas (
  id SERIAL PRIMARY KEY,
  auto_id INT UNIQUE NOT NULL,
  comprador_id INT NOT NULL,
  fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_auto FOREIGN KEY (auto_id) REFERENCES autos(id),
  CONSTRAINT fk_comprador FOREIGN KEY (comprador_id) REFERENCES compradores(id)
);

-- ==========================================
-- INSERTAR DATOS INICIALES DE PRUEBA
-- ==========================================
INSERT INTO marcas (nombre) VALUES ('Toyota'), ('Mitsubishi') ON CONFLICT DO NOTHING;
INSERT INTO modelos (nombre, marca_id) VALUES ('Corolla', 1), ('Outlander', 2) ON CONFLICT DO NOTHING;
INSERT INTO vendedores (nombre, telefono, ubicacion) VALUES ('Wilfredo Tobar', '5555-1234', 'Zona 4, Mixco') ON CONFLICT DO NOTHING;
INSERT INTO compradores (nombre, email) VALUES ('Carlos Gómez', 'carlos@email.com') ON CONFLICT DO NOTHING;
INSERT INTO autos (titulo, precio, color, year, imagen_url, descripcion, modelo_id, vendedor_id) 
VALUES (
  'Outlander SE 2014 Full Equipo', 
  67000.00, 
  'Gris', 
  2014, 
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500', 
  'Excelente estado, bolsas de aire, sunroof.', 
  2, 
  1
) ON CONFLICT DO NOTHING;
`;

async function crearTablas() {
    try {
        console.log(' Conectando a la base de datos de Railway...');
        await pool.query(sqlScript);
        console.log(' ¡Tablas y datos iniciales creados exitosamente en Railway!');
    } catch (err) {
        console.error(' Error al crear la base de datos:', err);
    } finally {
        await pool.end();
    }
}

crearTablas();