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

  // Estado para la modal de compra
  const [autoSeleccionado, setAutoSeleccionado] = useState(null);
  const [compradoIds, setCompradoIds] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');

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
    setAutoSeleccionado(null);
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

  // Procesar la compra
  const confirmarCompra = (e) => {
    e.preventDefault();
    if (autoSeleccionado) {
      setCompradoIds([...compradoIds, autoSeleccionado.id]);
      setMensajeExito(`🎉 ¡Felicidades! Has comprado el ${autoSeleccionado.titulo} exitosamente.`);
      setAutoSeleccionado(null);

      // Limpiar mensaje de éxito después de 5 segundos
      setTimeout(() => setMensajeExito(''), 5000);
    }
  };

  // ==========================================
  // PANTALLA 1: INICIO DE SESIÓN (AZUL NEÓN)
  // ==========================================
  if (!estaAutenticado) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0f1d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        padding: '20px',
        color: '#e2e8f0'
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderRadius: '16px',
          border: '1px solid #00f3ff',
          boxShadow: '0 0 25px rgba(0, 243, 255, 0.35)',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '50px', marginBottom: '10px', filter: 'drop-shadow(0 0 10px #00f3ff)' }}>🏎️</div>
          <h2 style={{
            margin: '0 0 10px 0',
            color: '#00f3ff',
            textShadow: '0 0 10px rgba(0, 243, 255, 0.7)',
            fontSize: '26px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            PREDIO AUTOS GT
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '25px' }}>
            Acceso al Sistema Neón de Vehículos
          </p>

          {errorLogin && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#ff4d4d',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
              border: '1px solid #ef4444',
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
            }}>
              {errorLogin}
            </div>
          )}

          <form onSubmit={manejarLogin}>
            <div style={{ textAlign: 'left', marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#00f3ff', marginBottom: '6px', letterSpacing: '0.5px' }}>
                USUARIO
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
                  backgroundColor: '#070a13',
                  border: '1px solid #1e293b',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#00f3ff', marginBottom: '6px', letterSpacing: '0.5px' }}>
                CONTRASEÑA
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
                  backgroundColor: '#070a13',
                  border: '1px solid #1e293b',
                  color: '#ffffff',
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
                backgroundColor: '#00f3ff',
                color: '#070a13',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(0, 243, 255, 0.6)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Ingresar al Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PANTALLA 2: CATÁLOGO AZUL NEÓN (AUTENTICADO)
  // ==========================================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070a13',
      padding: '20px',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: '#e2e8f0'
    }}>

      {/* BARRA SUPERIOR NEÓN */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        padding: '18px 30px',
        borderRadius: '12px',
        border: '1px solid #00f3ff',
        boxShadow: '0 0 15px rgba(0, 243, 255, 0.25)',
        marginBottom: '25px',
        maxWidth: '1200px',
        margin: '0 auto 25px auto'
      }}>
        <div>
          <h2 style={{
            margin: 0,
            color: '#00f3ff',
            fontSize: '22px',
            textShadow: '0 0 8px rgba(0, 243, 255, 0.6)',
            letterSpacing: '1px'
          }}>
            ⚡ CATÁLOGO NEÓN GT
          </h2>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Piloto activo: <strong style={{ color: '#38bdf8' }}>{usuario}</strong>
          </span>
        </div>
        <button
          onClick={cerrarSesion}
          style={{
            backgroundColor: 'transparent',
            color: '#ff4d4d',
            border: '1px solid #ef4444',
            padding: '8px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
            textTransform: 'uppercase'
          }}
        >
          Desconectar
        </button>
      </header>

      {/* BANNER DE ÉXITO */}
      {mensajeExito && (
        <div style={{
          backgroundColor: 'rgba(0, 243, 255, 0.1)',
          color: '#00f3ff',
          padding: '14px',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: '20px',
          border: '1px solid #00f3ff',
          boxShadow: '0 0 15px rgba(0, 243, 255, 0.3)',
          maxWidth: '1200px',
          margin: '0 auto 20px auto'
        }}>
          {mensajeExito}
        </div>
      )}

      {/* ESTADO DE CARGA */}
      {cargando && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#00f3ff', fontSize: '18px' }}>
          ⚡ Cargando inventario futurista desde PostgreSQL...
        </div>
      )}

      {/* ESTADO DE ERROR */}
      {errorApi && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#ff4d4d', fontSize: '18px' }}>
          ❌ {errorApi}
        </div>
      )}

      {/* TARJETAS DE AUTOS NEÓN */}
      {!cargando && !errorApi && (
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
                backgroundColor: '#0f172a',
                borderRadius: '14px',
                overflow: 'hidden',
                border: estaVendido ? '1px solid #334155' : '1px solid rgba(0, 243, 255, 0.4)',
                boxShadow: estaVendido ? 'none' : '0 0 15px rgba(0, 243, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: estaVendido ? 0.6 : 1,
                transition: 'transform 0.2s, box-shadow 0.2s'
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
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: '0 0 10px rgba(239, 68, 68, 0.6)'
                      }}>
                        AGOTADO
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {auto.marca} {auto.modelo} • {auto.year}
                    </span>
                    <h3 style={{ margin: '8px 0', fontSize: '16px', color: '#ffffff' }}>
                      {auto.titulo}
                    </h3>
                    <p style={{
                      color: '#00f3ff',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      margin: '8px 0',
                      textShadow: '0 0 8px rgba(0, 243, 255, 0.5)'
                    }}>
                      Q {Number(auto.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </p>
                    <p style={{ fontSize: '13px', color: '#94a3b8', height: '36px', overflow: 'hidden' }}>
                      {auto.descripcion}
                    </p>
                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1e293b', fontSize: '12px', color: '#64748b' }}>
                      📍 {auto.ubicacion} <br />
                      👤 Vendedor: {auto.vendedor}
                    </div>
                  </div>
                </div>

                {/* BOTÓN DE COMPRA NEÓN */}
                <div style={{ padding: '0 16px 16px 16px' }}>
                  <button
                    onClick={() => setAutoSeleccionado(auto)}
                    disabled={estaVendido}
                    style={{
                      width: '100%',
                      backgroundColor: estaVendido ? '#334155' : 'transparent',
                      color: estaVendido ? '#94a3b8' : '#00f3ff',
                      border: estaVendido ? 'none' : '1px solid #00f3ff',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      cursor: estaVendido ? 'not-allowed' : 'pointer',
                      boxShadow: estaVendido ? 'none' : '0 0 10px rgba(0, 243, 255, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    {estaVendido ? '🚗 Vehículo Vendido' : '🛒 Comprar Auto'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE COMPRA NEÓN */}
      {autoSeleccionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 8, 16, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            padding: '30px',
            borderRadius: '16px',
            maxWidth: '450px',
            width: '100%',
            border: '1px solid #00f3ff',
            boxShadow: '0 0 25px rgba(0, 243, 255, 0.4)',
            color: '#ffffff'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00f3ff', textShadow: '0 0 8px rgba(0, 243, 255, 0.5)' }}>
              Confirmar Adquisición 🚗
            </h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '15px' }}>
              Estás reservando el siguiente vehículo en nuestro sistema:
            </p>

            <div style={{ backgroundColor: '#070a13', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #1e293b' }}>
              <strong style={{ color: '#38bdf8' }}>{autoSeleccionado.titulo}</strong>
              <div style={{ color: '#00f3ff', fontSize: '20px', fontWeight: 'bold', marginTop: '5px', textShadow: '0 0 8px rgba(0, 243, 255, 0.5)' }}>
                Q {Number(autoSeleccionado.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <form onSubmit={confirmarCompra}>
              <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#00f3ff', marginBottom: '4px', letterSpacing: '0.5px' }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  defaultValue={usuario}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#070a13', border: '1px solid #1e293b', color: 'white', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#00f3ff', marginBottom: '4px', letterSpacing: '0.5px' }}>
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#070a13', border: '1px solid #1e293b', color: 'white', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAutoSeleccionado(null)}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    color: '#94a3b8',
                    border: '1px solid #334155',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#00f3ff',
                    color: '#070a13',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
                  }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;