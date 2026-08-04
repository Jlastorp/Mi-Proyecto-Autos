import React from 'react';

function Encabezado({ usuario, cerrarSesion }) {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#111827',
            padding: '18px 30px',
            borderRadius: '12px',
            border: '1px solid #1f2937',
            marginBottom: '25px',
            maxWidth: '1200px',
            margin: '0 auto 25px auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
        }}>
            <div>
                <h2 style={{
                    margin: 0,
                    color: '#60a5fa',
                    fontSize: '22px',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                }}>
                    🏎️ VENTAS DE AUTO LICEO
                </h2>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    Usuario activo: <strong style={{ color: '#f3f4f6' }}>{usuario}</strong>
                </span>
            </div>
            <button
                onClick={cerrarSesion}
                style={{
                    backgroundColor: 'transparent',
                    color: '#f87171',
                    border: '1px solid #ef4444',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                }}
            >
                Desconectar
            </button>
        </header>
    );
}

export default Encabezado;