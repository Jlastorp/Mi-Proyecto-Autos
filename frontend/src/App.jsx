import { useEffect, useState } from 'react';

function App() {
  // Estados de autenticación
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  // Estados del catálogo
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  // Credenciales requeridas
  const USUARIO_CORRECTO = "Jlastorp";
  const PASSWORD_CORRECTA = "45261705";

  // Función para procesar el inicio de sesión
  const manejarLogin = (e) => {
    e.preventDefault();
    setErrorLogin('');

    if (usuario === USUARIO_CORRECTO && password === PASSWORD_CORRECTA) {
      setEstaAutenticado(true);
    } else {
      setErrorLogin('❌ Usuario o contraseña incorrectos. Cliente no registrado.');
    }
  };

  // Función para salir / cerrar sesión
  const cerrarSesion = () => {
    setEstaAutenticado(false);
    setUsuario('');
    setPassword('');
    setErrorLogin('');
  };

  // Cargar autos cuando se autentique el usuario
  useEffect(() => {
    if (estaAutenticado) {
      fetch('http://localhost:3000/api/autos')
        .then((res) => {
          if (!res.ok) throw new Error('Error en el servidor');
          return res.json();
        })
        .then((data) => {
          setAutos(data);
          setCargando(false);
        })
        .catch((err) => {
          console.error(err);
          setErrorApi('No se pudo conectar con el servidor Express.');
          setCargando(false);
        });
    }
  }, [estaAutenticado]);

  // ==========================================
  // PANTALLA 1: INICIO DE SESIÓN (LOGIN)
  // ==========================================
  if (!estaAutenticado) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚘</div>
          <h2 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>
            Predio de Autos GT
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '25px' }}>
            Inicia sesión para ver nuestro inventario exclusivo
          </p>

          {/* MENSAJE DE ERROR SI Falla EL LOGIN */}
          {errorLogin && (
            <div style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
              border: '1px solid #fecaca',
              fontWeight: 'bold'
            }}>
              {errorLogin}
            </div>
          )}

          <form onSubmit={manejarLogin}>
            <div style={{ textAlign: 'left', marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
                Usuario
              </label>
              <input
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '6px' }}>
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Ingresar al Catálogo
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PANTALLA 2: CATÁLOGO DE AUTOS (AUTENTICADO)
  // ==========================================
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>

      {/* BARRA SUPERIOR DE BIENVENIDA */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: '15px 30px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>🚘 Catálogo Guatemala</h2>
          <span style={{ fontSize: '13px', color: '#64748b' }}>Bienvenido, <strong>{usuario}</strong></span>
        </div>
        <button
          onClick={cerrarSesion}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      {/* ESTADO DE CARGA */}
      {cargando && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          🚗 Cargando catálogo desde la base de datos...
        </div>
      )}

      {/* ESTADO DE ERROR */}
      {errorApi && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#dc2626' }}>
          ❌ {errorApi}
        </div>
      )}

      {/* REJILLA DE TARJETAS DE AUTOS */}
      {!cargando && !errorApi && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {autos.map(auto => (
            <div key={auto.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <img
                src={auto.imagen_url}
                alt={auto.titulo}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '16px' }}>
                <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {auto.marca} {auto.modelo} • {auto.year}
                </span>
                <h3 style={{ margin: '8px 0', fontSize: '16px', color: '#0f172a' }}>
                  {auto.titulo}
                </h3>
                <p style={{ color: '#16a34a', fontSize: '20px', fontWeight: 'bold', margin: '8px 0' }}>
                  Q {Number(auto.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </p>
                <p style={{ fontSize: '13px', color: '#64748b', height: '36px', overflow: 'hidden' }}>
                  {auto.descripcion}
                </p>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '12px', color: '#64748b' }}>
                  📍 {auto.ubicacion} <br />
                  👤 Vendedor: {auto.vendedor}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;