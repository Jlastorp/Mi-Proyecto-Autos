import { useEffect, useState } from 'react';

function App() {
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Petición a tu API local
    fetch('http://localhost:3000/api/autos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudo conectar con la API');
        }
        return res.json();
      })
      .then((data) => {
        setAutos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al obtener autos:', err);
        setError('No se pudo conectar con el servidor Express.');
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
        🚗 Cargando autos desde la base de datos...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red', fontSize: '18px' }}>
        ❌ {error} <br />
        <small style={{ color: '#666' }}>Asegúrate de que 'node server.js' esté corriendo en la terminal del Backend.</small>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#1a202c' }}>
        🚘 Catálogo de Autos en Guatemala
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {autos.map(auto => (
          <div key={auto.id} style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
          }}>
            <img
              src={auto.imagen_url}
              alt={auto.titulo}
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '15px' }}>
              <span style={{ fontSize: '12px', color: '#718096', fontWeight: 'bold' }}>
                {auto.marca} {auto.modelo} ({auto.year})
              </span>
              <h3 style={{ margin: '8px 0', fontSize: '18px', color: '#2d3748' }}>
                {auto.titulo}
              </h3>
              <p style={{ color: '#e53e3e', fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }}>
                Q {Number(auto.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </p>
              <p style={{ fontSize: '14px', color: '#4a5568', height: '40px', overflow: 'hidden' }}>
                {auto.descripcion}
              </p>
              <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #edf2f7', fontSize: '12px', color: '#718096' }}>
                📍 {auto.ubicacion} <br />
                👤 {auto.vendedor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;