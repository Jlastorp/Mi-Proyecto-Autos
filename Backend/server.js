import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('🚗 Bienvenido a la API de la Tienda de Autos');
});


app.get('/api/autos', async (req, res) => {
    try {
        const consulta = `
      SELECT 
        autos.id,
        autos.titulo,
        autos.precio,
        autos.color,
        autos.year,
        autos.imagen_url,
        autos.descripcion,
        marcas.nombre AS marca,
        modelos.nombre AS modelo,
        vendedores.nombre AS vendedor,
        vendedores.ubicacion,
        vendedores.telefono
      FROM autos
      JOIN modelos ON autos.modelo_id = modelos.id
      JOIN marcas ON modelos.marca_id = marcas.id
      JOIN vendedores ON autos.vendedor_id = vendedores.id
      ORDER BY autos.id DESC;
    `;

        const resultado = await pool.query(consulta);
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener autos:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
});

// Obtener un solo auto por su ID
app.get('/api/autos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const consulta = `
      SELECT 
        autos.id,
        autos.titulo,
        autos.precio,
        autos.color,
        autos.year,
        autos.imagen_url,
        autos.descripcion,
        marcas.nombre AS marca,
        modelos.nombre AS modelo,
        vendedores.nombre AS vendedor,
        vendedores.ubicacion,
        vendedores.telefono
      FROM autos
      JOIN modelos ON autos.modelo_id = modelos.id
      JOIN marcas ON modelos.marca_id = marcas.id
      JOIN vendedores ON autos.vendedor_id = vendedores.id
      WHERE autos.id = $1;
    `;

        const resultado = await pool.query(consulta, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: 'Auto no encontrado' });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al obtener el auto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});


// 1. Crear tabla de ventas al iniciar (si no existe)
db.run(`
  CREATE TABLE IF NOT EXISTS ventas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auto_id INTEGER,
    titulo_auto TEXT,
    precio REAL,
    cliente TEXT,
    correo TEXT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 2. Ruta para GUARDAR una venta (Usado por el cliente)
app.post('/api/ventas', (req, res) => {
    const { auto_id, titulo_auto, precio, cliente, correo } = req.body;

    const sql = `INSERT INTO ventas (auto_id, titulo_auto, precio, cliente, correo) VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [auto_id, titulo_auto, precio, cliente, correo], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al registrar la venta' });
        }
        res.json({ mensaje: 'Venta registrada con éxito', ventaId: this.lastID });
    });
});

// 3. Ruta para OBTENER todas las ventas (Usado por el Admin)
app.get('/api/ventas', (req, res) => {
    db.all(`SELECT * FROM ventas ORDER BY fecha DESC`, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener las ventas' });
        }
        res.json(rows);
    });
});