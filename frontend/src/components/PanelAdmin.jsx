import { useEffect, useState } from 'react';

function PanelAdmin({ autos = [] }) {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Estados para controlar el formulario CRUD (Crear / Editar)
    const [modoEdicion, setModoEdicion] = useState(false);
    const [idVentaEditando, setIdVentaEditando] = useState(null);
    const [formulario, setFormulario] = useState({
        titulo_auto: '',
        cliente: '',
        correo: '',
        precio: ''
    });

    // Cargar las ventas registradas desde la API en PostgreSQL
    const cargarVentas = () => {
        setCargando(true);
        fetch('/api/ventas')
            .then((res) => {
                if (!res.ok) throw new Error('Error al obtener ventas');
                return res.json();
            })
            .then((data) => {
                setVentas(Array.isArray(data) ? data : []);
                setCargando(false);
            })
            .catch((err) => {
                console.error('Error al cargar ventas:', err);
                setCargando(false);
            });
    };

    useEffect(() => {
        cargarVentas();
    }, []);

    // Manejar cambios en losinputs del formulario
    const manejarCambioInput = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };

    // CREAR o ACTUALIZAR venta (Submit del formulario)
    const guardarVenta = (e) => {
        e.preventDefault();
        const url = modoEdicion
            ? `/api/ventas/${idVentaEditando}`
            : '/api/ventas';
        const metodo = modoEdicion ? 'PUT' : 'POST';

        fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formulario)
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error al guardar la venta');
                return res.json();
            })
            .then(() => {
                cargarVentas();
                limpiarFormulario();
            })
            .catch((err) => console.error('Error:', err));
    };

    // PREPARAR formulario para editar
    const iniciarEdicion = (venta) => {
        setModoEdicion(true);
        setIdVentaEditando(venta.id);
        setFormulario({
            titulo_auto: venta.titulo_auto,
            cliente: venta.cliente,
            correo: venta.correo,
            precio: venta.precio
        });
    };

    // ELIMINAR venta
    const eliminarVenta = (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este registro de venta?')) return;

        fetch(`/api/ventas/${id}`, {
            method: 'DELETE'
        })
            .then((res) => {
                if (!res.ok) throw new Error('Error al eliminar venta');
                cargarVentas();
            })
            .catch((err) => console.error('Error al eliminar:', err));
    };

    // Limpiar formulario y salir del modo edición
    const limpiarFormulario = () => {
        setModoEdicion(false);
        setIdVentaEditando(null);
        setFormulario({ titulo_auto: '', cliente: '', correo: '', precio: '' });
    };

    // Calcular total acumulado en dinero y total de vehículos vendidos
    const totalIngresos = ventas.reduce((acc, v) => acc + Number(v.precio || 0), 0);
    const vehiculosVendidosCount = ventas.length;
    const totalAutosDisponibles = autos.length;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px', fontFamily: 'sans-serif' }}>
            {/* TARJETAS SUPERIORES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>
                        TOTAL EN VENTAS
                    </span>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginTop: '10px' }}>
                        Q {totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase' }}>
                        VEHÍCULOS VENDIDOS
                    </span>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#60a5fa', marginTop: '10px' }}>
                        {vehiculosVendidosCount} / {totalAutosDisponibles || 8}
                    </div>
                </div>
            </div>

            {/* FORMULARIO CRUD (CREAR / EDITAR) */}
            <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937', marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#f3f4f6' }}>
                    {modoEdicion ? '✏️ Editar Venta Registrada' : '➕ Registrar Nueva Venta Manual'}
                </h3>
                <form onSubmit={guardarVenta} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
                    <input
                        type="text"
                        name="titulo_auto"
                        placeholder="Vehículo (Ej. Toyota Hilux)"
                        value={formulario.titulo_auto}
                        onChange={manejarCambioInput}
                        required
                        style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                    />
                    <input
                        type="text"
                        name="cliente"
                        placeholder="Nombre del Cliente"
                        value={formulario.cliente}
                        onChange={manejarCambioInput}
                        required
                        style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                    />
                    <input
                        type="email"
                        name="correo"
                        placeholder="Correo Electrónico"
                        value={formulario.correo}
                        onChange={manejarCambioInput}
                        required
                        style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                    />
                    <input
                        type="number"
                        name="precio"
                        placeholder="Precio (Q)"
                        value={formulario.precio}
                        onChange={manejarCambioInput}
                        required
                        style={{ padding: '10px', borderRadius: '6px', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff' }}
                    />
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" style={{ backgroundColor: modoEdicion ? '#3b82f6' : '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {modoEdicion ? 'Actualizar Venta' : 'Guardar Venta'}
                        </button>
                        {modoEdicion && (
                            <button type="button" onClick={limpiarFormulario} style={{ backgroundColor: '#4b5563', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* SECCIÓN PEDIDOS / VENTAS REGISTRADAS */}
            <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📦 Pedidos y Ventas Registrados en Base de Datos
                </h3>

                {cargando ? (
                    <p style={{ color: '#9ca3af', textAlign: 'center' }}>Cargando ventas desde la base de datos...</p>
                ) : ventas.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0' }}>
                        No hay compras registradas en la base de datos aún.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#e5e7eb' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #374151', color: '#9ca3af', fontSize: '13px' }}>
                                    <th style={{ padding: '12px' }}>ID</th>
                                    <th style={{ padding: '12px' }}>Vehículo</th>
                                    <th style={{ padding: '12px' }}>Cliente</th>
                                    <th style={{ padding: '12px' }}>Correo</th>
                                    <th style={{ padding: '12px' }}>Precio</th>
                                    <th style={{ padding: '12px' }}>Fecha</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map((v) => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid #1f2937' }}>
                                        <td style={{ padding: '12px', color: '#9ca3af' }}>#{v.id}</td>
                                        <td style={{ padding: '12px', fontWeight: '600' }}>{v.titulo_auto}</td>
                                        <td style={{ padding: '12px' }}>{v.cliente}</td>
                                        <td style={{ padding: '12px', color: '#9ca3af' }}>{v.correo}</td>
                                        <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>
                                            Q {Number(v.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '12px', color: '#9ca3af' }}>
                                            {new Date(v.fecha).toLocaleString('es-GT')}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button
                                                onClick={() => iniciarEdicion(v)}
                                                style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarVenta(v.id)}
                                                style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PanelAdmin; 