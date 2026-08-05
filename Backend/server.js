const express = require('express');
const cors = require('cors');
const { pool } = require('./db.js');

const app = express();

// OBLIGATORIO: Permitir peticiones de React y procesar JSON
app.use(cors());
app.use(express.json());

// 0. OBTENER AUTOS Y CATÁLOGO
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

// 1. OBTENER TODAS LAS VENTAS (GET)
app.get('/api/ventas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM ventas ORDER BY id DESC');
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener las ventas' });
    }
});

// 2. CREAR NUEVA VENTA (POST)
app.post('/api/ventas', async (req, res) => {
    const { auto_id, titulo_auto, cliente, correo, precio } = req.body;
    try {
        const resultado = await pool.query(
            'INSERT INTO ventas (auto_id, titulo_auto, cliente, correo, precio, fecha) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
            [auto_id || null, titulo_auto, cliente, correo, parseFloat(precio)]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error("Error en POST:", error);
        res.status(500).json({ mensaje: 'Error al registrar la venta' });
    }
});

// 3. EDITAR VENTA (PUT)
app.put('/api/ventas/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo_auto, cliente, correo, precio } = req.body;
    try {
        const resultado = await pool.query(
            'UPDATE ventas SET titulo_auto = $1, cliente = $2, correo = $3, precio = $4 WHERE id = $5 RETURNING *',
            [titulo_auto, cliente, correo, parseFloat(precio), id]
        );
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("Error en PUT:", error);
        res.status(500).json({ mensaje: 'Error al actualizar la venta' });
    }
});

// 4. ELIMINAR VENTA (DELETE)
app.delete('/api/ventas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ventas WHERE id = $1', [id]);
        res.json({ mensaje: 'Venta eliminada correctamente' });
    } catch (error) {
        console.error("Error en DELETE:", error);
        res.status(500).json({ mensaje: 'Error al eliminar la venta' });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});