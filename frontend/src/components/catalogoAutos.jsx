import React from 'react';

function catalogoAutos({ autos, cargando, errorApi, compradoIds, setAutoSeleccionado }) {
    if (cargando) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#60a5fa', fontSize: '18px' }}>
                ⚡ Cargando inventario desde la base de datos...
            </div>
        );
    }

    if (errorApi) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#f87171', fontSize: '18px' }}>
                ❌ {errorApi}
            </div>
        );
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {autos.map(auto => {
                const estaVendido = compradoIds.includes(auto.id);
                return (
                    <div key={auto.id} style={{
                        backgroundColor: '#111827',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: '1px solid #1f2937',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        opacity: estaVendido ? 0.6 : 1,
                        transition: 'transform 0.2s'
                    }}>
                        <div>
                            <div style={{ position: 'relative' }}>
                                <img
                                    src={auto.imagen_url}
                                    alt={auto.titulo}
                                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                />
                                {estaVendido && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        backgroundColor: '#dc2626',
                                        color: 'white',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 'bold'
                                    }}>
                                        AGOTADO
                                    </span>
                                )}
                            </div>
                            <div style={{ padding: '16px' }}>
                                <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {auto.marca} {auto.modelo} • {auto.year}
                                </span>
                                <h3 style={{ margin: '8px 0', fontSize: '16px', color: '#ffffff' }}>
                                    {auto.titulo}
                                </h3>
                                <p style={{
                                    color: '#38bdf8',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    margin: '8px 0'
                                }}>
                                    Q {Number(auto.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                                </p>
                                <p style={{ fontSize: '13px', color: '#9ca3af', height: '36px', overflow: 'hidden' }}>
                                    {auto.descripcion}
                                </p>
                                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1f2937', fontSize: '12px', color: '#6b7280' }}>
                                    📍 {auto.ubicacion} <br />
                                    👤 Vendedor: {auto.vendedor}
                                </div>
                            </div>
                        </div>

                        {/* BOTÓN DE COMPRA VERDE */}
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            <button
                                onClick={() => setAutoSeleccionado(auto)}
                                disabled={estaVendido}
                                style={{
                                    width: '100%',
                                    backgroundColor: estaVendido ? '#374151' : '#16a34a',
                                    color: estaVendido ? '#9ca3af' : '#ffffff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 'bold',
                                    cursor: estaVendido ? 'not-allowed' : 'pointer',
                                    boxShadow: estaVendido ? 'none' : '0 4px 6px -1px rgba(22, 163, 74, 0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}
                            >
                                {estaVendido ? '🚗 Vehículo Vendido' : '🛒 Comprar Auto'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default catalogoAutos;