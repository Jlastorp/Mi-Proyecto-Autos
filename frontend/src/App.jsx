import { useEffect, useState } from 'react';
import Encabezado from './components/Encabezado';
import CatalogoAutos from './components/catalogoAutos'; // Verifica si en tu PC es 'CatalogoAutos' o 'catalogoAutos'
import PiePagina from './components/PiePagina';
import PanelAdmin from './components/PanelAdmin';

function App() {
  // Estados de autenticación
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [rol, setRol] = useState(''); // 'cliente' o 'admin'
  const [errorLogin, setErrorLogin] = useState('');

  // Estados del catálogo
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorApi, setErrorApi] = useState(null);

  // Estados de compras / ventas
  const [autoSeleccionado, setAutoSeleccionado] = useState(null);
  const [compradoIds, setCompradoIds] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');

  // Formulario modal de compra
  const [correoCliente, setCorreoCliente] = useState('');

  // CREDENCIALES
  const CLIENTE_USER = "Jlastorp";
  const CLIENTE_PASS = "45261705";

  const ADMIN_USER = "jadmin";
  const ADMIN_PASS = "45261405";

  // Procesar login
  const manejarLogin = (e) => {
    e.preventDefault();
    setErrorLogin('');

    if (usuario === CLIENTE_USER && password === CLIENTE_PASS) {
      setRol('cliente');
      setEstaAutenticado(true);
    } else if (usuario === ADMIN_USER && password === ADMIN_PASS) {
      setRol('admin');
      setEstaAutenticado(true);
    } else {
      setErrorLogin('❌ Usuario o contraseña incorrectos.');
    }
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    setEstaAutenticado(false);
    setRol('');
    setUsuario('');
    setPassword('');
    setErrorLogin('');
    setAutoSeleccionado(null);
  };

  // Cargar catálogo desde la API
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

  // Procesar compra guardándola en el servidor Express
  const confirmarCompra = async (e) => {
    e.preventDefault();
    if (!autoSeleccionado) return;

    const datosVenta = {
      auto_id: autoSeleccionado.id,
      titulo_auto: autoSeleccionado.titulo,
      precio: autoSeleccionado.precio,
      cliente: usuario,
      correo: correoCliente || 'cliente@liceo.com'
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosVenta)
      });

      if (respuesta.ok) {
        setCompradoIds([...compradoIds, autoSeleccionado.id]);
        setMensajeExito(`🎉 ¡Felicidades! Has comprado el ${autoSeleccionado.titulo} exitosamente.`);
        setAutoSeleccionado(null);
        setCorreoCliente('');

        setTimeout(() => setMensajeExito(''), 5000);
      } else {
        alert('Error en el servidor al procesar la compra.');
      }
    } catch (error) {
      console.error('Error enviando la compra:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  // PANTALLA DE LOGIN
  if (!estaAutenticado) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0b0f19',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        padding: '20px',
        color: '#f3f4f6'
      }}>
        <div style={{
          backgroundColor: '#111827',
          borderRadius: '16px',
          border: '1px solid #1f2937',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '46px', marginBottom: '12px' }}>🏎️</div>
          <h2 style={{ margin: '0 0 8px 0', color: '#3b82f6', fontSize: '24px', fontWeight: '700' }}>
            VENTAS DE AUTO LICEO
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '25px' }}>
            Acceso a Clientes y Vendedores
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px' }}>
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#9ca3af', marginBottom: '6px' }}>
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
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Ingresar al Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // VISTA PRINCIPAL SEGÚN EL ROL
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0b0f19',
      padding: '20px',
      fontFamily: "'Segoe UI', Roboto, sans-serif",
      color: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        {/* COMPONENTE 1: ENCABEZADO */}
        <Encabezado usuario={`${usuario} (${rol === 'admin' ? 'Vendedor/Admin' : 'Cliente'})`} cerrarSesion={cerrarSesion} />

        {/* BANNER DE ÉXITO PARA CLIENTE */}
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

        {/* SI ES ADMIN/VENDEDOR -> MUESTRA PANEL ADMIN */}
        {rol === 'admin' ? (
          <PanelAdmin autos={autos} />
        ) : (
          /* SI ES CLIENTE -> MUESTRA EL CATÁLOGO */
          <CatalogoAutos
            autos={autos}
            cargando={cargando}
            errorApi={errorApi}
            compradoIds={compradoIds}
            setAutoSeleccionado={setAutoSeleccionado}
          />
        )}
      </div>

      {/* COMPONENTE 3: PIE DE PÁGINA */}
      <PiePagina />

      {/* MODAL DE COMPRA (SOLO CLIENTE) */}
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
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '4px' }}>
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
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '4px' }}>
                  CORREO ELECTRÓNICO
                </label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  value={correoCliente}
                  onChange={(e) => setCorreoCliente(e.target.value)}
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
                    backgroundColor: '#16a34a',
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