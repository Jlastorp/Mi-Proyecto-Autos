import React from 'react';

function PiePagina() {
    return (
        <footer style={{
            marginTop: '50px',
            borderTop: '1px solid #1f2937',
            paddingTop: '20px',
            paddingBottom: '20px',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '13px',
            maxWidth: '1200px',
            margin: '50px auto 0 auto'
        }}>
            <p style={{ margin: '0 0 5px 0' }}>
                © {new Date().getFullYear()} <strong style={{ color: '#9ca3af' }}>VENTAS DE AUTO LICEO</strong>. Todos los derechos reservados.
            </p>
            <p style={{ margin: 0, fontSize: '12px' }}>
                Sistema de catálogo y gestión de ventas de vehículos.
            </p>
        </footer>
    );
}

export default PiePagina;