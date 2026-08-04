import React, { useEffect, useState } from 'react';

function PanelAdmin({ autos }) {
    const [ventas, setVentas] = useState([]);
    const [cargando, setCargando] = useState(true);

    // Cargar las ventas reales desde la Base de Datos
    useEffect(() => {
        fetch('http://localhost:3000/api/ventas')
            .then((res) => res.json())
            .then((data) => {
                setVentas(data);
                setCargando(false);
            })
            .catch((err) => {
                console.error('Error cargando ventas:', err);
                setCargando(false);
            });
    }, []);

    const totalIngresos = ventas.reduce((acc, venta) => acc + Number(venta.precio), 0);

    if (cargando) {
        return <div style={{ textAlign: 'center', color: '#60a5fa', padding: '40px' }}>⚡ Cargando ventas desde la base de datos...</div>;
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* TARJETAS DE RESUMEN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937', borderLeft: '4px solid #16a34a' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>Total en Ventas</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#4ade80', fontSize: '26px' }}>
                        Q {totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </h3>
                </div>

                <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937', borderLeft: '4px solid #2563eb' }}>
                    <span style={{ fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 'bold' }}>Vehículos Vendidos</span>
                    <h3 style={{ margin: '8px 0 0 0', color: '#60a5fa', fontSize: '26px' }}>
                        {ventas.length} / {autos.length}
                    </h3>
                </div>
            </div>

            {/* TABLA DE VENTAS PERMANENTES */}
            <div style={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #1f2937', padding: '24px' }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#60a5fa', fontSize: '18px' }}>
                    📦 Pedidos Registrados en Base de Datos
                </h3>

                {ventas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#9ca3af' }}>
                        No hay compras registradas en la base de datos aún.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #374151', color: '#9ca3af' }}>
                                    <th style={{ padding: '12px' }}>ID Venta</th>
                                    <th style={{ padding: '12px' }}>Vehículo</th>
                                    <th style={{ padding: '12px' }}>Cliente</th>
                                    <th style={{ padding: '12px' }}>Correo</th>
                                    <th style={{ padding: '12px' }}>Precio</th>
                                    <th style={{ padding: '12px' }}>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map((v) => (
                                    <tr key={v.id} style={{ borderBottom: '1px solid #1f2937', color: '#f3f4f6' }}>
                                        <td style={{ padding: '12px', color: '#6b7280' }}>#{v.id}</td>
                                        <td style={{ padding: '12px', fontWeight: '600', color: '#93c5fd' }}>{v.titulo_auto}</td>
                                        <td style={{ padding: '12px' }}>{v.cliente}</td>
                                        <td style={{ padding: '12px', color: '#9ca3af' }}>{v.correo}</td>
                                        <td style={{ padding: '12px', color: '#4ade80', fontWeight: 'bold' }}>
                                            Q {Number(v.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td style={{ padding: '12px', color: '#9ca3af', fontSize: '12px' }}>{v.fecha}</td>
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