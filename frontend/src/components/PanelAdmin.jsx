import { useEffect, useState } from 'react';

function PanelAdmin({ autos = [] }) {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Cargar las ventas registradas desde la API en PostgreSQL
    const cargarVentas = () => {
        fetch('http://localhost:3000/api/ventas')
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

    // Calcular total acumulado en dinero y total de vehículos vendidos
    const totalIngresos = ventas.reduce((acc, v) => acc + Number(v.precio || 0), 0);
    const vehiculosVendidosCount = ventas.length;
    const totalAutosDisponibles = autos.length;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '10px' }}>
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

            {/* SECCIÓN PEDIDOS REGISTRADOS */}
            <div style={{ backgroundColor: '#111827', padding: '25px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    📦 Pedidos Registrados en Base de Datos
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