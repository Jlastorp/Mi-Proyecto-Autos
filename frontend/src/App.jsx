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
  // PANTALLA 1: INICIO DE SESIÓN (DARK MODE ELEGANTE)
  // ==========================================
  if (!estaAutenticado) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0b0f19', // Fondo oscuro mate
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        padding: '20px',
        color: '#f3f4f6'
      }}>
        <div style={{
          backgroundColor: '#111827', // Tarjeta gris/azul muy oscura
          borderRadius: '16px',
          border: '1px solid #1f2937',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '46px', marginBottom: '12px' }}>🏎️</div>
          <h2 style={{
            margin: '0 0 8px 0',
            color: '#3b82f6', // Azul elegante
            fontSize: '24px',
            fontWeight: '700',
            letterSpacing: '0.5px'
          }}>
            VENTAS DE AUTO LICEO
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '25px' }}>
            Acceso al Sistema de Vehículos
          </p>

          {errorLogin && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
              border: '1px solid #ef4444',
              fontWeight: '600'
            }}>
              {errorLogin}
            </div>
          )}

          <form onSubmit={manejarLogin}>
            <div style={{ textAlign: 'left', marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', letterSpacing: '0.5px' }}>
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
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px', letterSpacing: '0.5px' }}>
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
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
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
                backgroundColor: '#2563eb', // Azul profesional
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                letterSpacing: '0.5px',
                transition: 'background-color 0.2s'
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
  // PANTALLA 2: CATÁLOGO OSCURO ELEGANTE (AUTENTICADO)
  // ==========================================
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b0f19', // Fondo oscuro
      padding: '20px',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: '#f3f4f6'
    }}>

      {/* BARRA SUPERIOR OSCURA */}
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

      {/* BANNER DE ÉXITO */}
      {mensajeExito && (
        <div style={{
          backgroundColor: 'rgba(22, 163, 74, 0.15)',
          color: '#4ade80',
          padding: '14px',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: '600',
          marginBottom: '20px',
          border: '1px solid #16a34a',
          maxWidth: '1200px',
          margin: '0 auto 20px auto'
        }}>
          {mensajeExito}
        </div>
      )}

      {/* ESTADO DE CARGA */}
      {cargando && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#60a5fa', fontSize: '18px' }}>
          ⚡ Cargando inventario desde la base de datos...
        </div>
      )}

      {/* ESTADO DE ERROR */}
      {errorApi && (
        <div style={{ textAlign: 'center', padding: '50px', color: '#f87171', fontSize: '18px' }}>
          ❌ {errorApi}
        </div>
      )}

      {/* TARJETAS DE AUTOS */}
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

                {/* BOTÓN DE COMPRA VERDE 🟢 */}
                <div style={{ padding: '0 16px 16px 16px' }}>
                  <button
                    onClick={() => setAutoSeleccionado(auto)}
                    disabled={estaVendido}
                    style={{
                      width: '100%',
                      backgroundColor: estaVendido ? '#374151' : '#16a34a', // Verde vibrante
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
      )}

      {/* MODAL DE COMPRA OSCURA */}
      {autoSeleccionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#111827',
            padding: '30px',
            borderRadius: '16px',
            maxWidth: '450px',
            width: '100%',
            border: '1px solid #374151',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            color: '#ffffff'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#60a5fa' }}>
              Confirmar Adquisición 🚗
            </h3>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '15px' }}>
              Estás reservando el siguiente vehículo en Ventas de Auto Liceo:
            </p>

            <div style={{ backgroundColor: '#1f2937', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #374151' }}>
              <strong style={{ color: '#93c5fd' }}>{autoSeleccionado.titulo}</strong>
              <div style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold', marginTop: '5px' }}>
                Q {Number(autoSeleccionado.precio).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <form onSubmit={confirmarCompra}>
              <div style={{ marginBottom: '14px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.5px' }}>
                  NOMBRE COMPLETO
                </label>
                <input
                  type="text"
                  defaultValue={usuario}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1f2937', border: '1px solid #374151', color: 'white', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '4px', letterSpacing: '0.5px' }}>
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#1f2937', border: '1px solid #374151', color: 'white', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setAutoSeleccionado(null)}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    color: '#9ca3af',
                    border: '1px solid #374151',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    backgroundColor: '#16a34a', // Verde vibrante
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer'
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