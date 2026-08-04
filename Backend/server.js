import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicializar tabla de ventas en PostgreSQL
const crearTablaVentas = async () => {
    try {
        // Borra la tabla vieja que no tiene la columna titulo_auto
        await pool.query(`DROP TABLE IF EXISTS ventas;`);

        // Crea la tabla nueva con la estructura correcta
        await pool.query(`
            CREATE TABLE ventas (
                id SERIAL PRIMARY KEY,
                auto_id INT,
                titulo_auto VARCHAR(255),
                precio NUMERIC,
                cliente VARCHAR(255),
                correo VARCHAR(255),
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Tabla "ventas" recreada con éxito en PostgreSQL');
    } catch (error) {
        console.error('Error al crear tabla ventas:', error);
    }
};


crearTablaVentas();

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('🚗 Bienvenido a la API de la Tienda de Autos');
});

// Obtener todos los autos
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

// Ruta para Registrar/Guardar una Venta
app.post('/api/ventas', async (req, res) => {
    const { auto_id, titulo_auto, precio, cliente, correo } = req.body;

    try {
        const consulta = `
            INSERT INTO ventas (auto_id, titulo_auto, precio, cliente, correo)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const valores = [auto_id, titulo_auto, precio, cliente, correo];
        const resultado = await pool.query(consulta, valores);

        res.status(201).json({
            mensaje: 'Venta registrada con éxito',
            venta: resultado.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        res.status(500).json({ error: 'Error al registrar la venta en la base de datos' });
    }
});

// Iniciar servidor al final
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
});