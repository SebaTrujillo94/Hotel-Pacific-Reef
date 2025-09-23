import React, { useState } from 'react';
import './App.css';
import SearchRooms from './components/SearchRooms';

// 🏨 Hotel Pacific Reef - Sistema de Gestión de Reservas
// Sistema web para autogestión de reservas, pagos y administración hotelera

interface Habitacion {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  disponible: boolean;
  servicios: string[];
  tipo: 'standard' | 'suite' | 'cabaña';
  capacidad: number;
  metrosCuadrados: number;
}

interface User {
  name: string;
  email: string;
  role: 'guest' | 'admin';
}

// Sistema de Diseño - Hotel Pacific Reef
const DESIGN_TOKENS = {
  colors: {
    primary: '#1e40af',
    secondary: '#0891b2',
    accent: '#f59e0b',
    success: '#059669',
    background: '#f8fafc',
    gradients: {
      ocean: 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%)',
      reef: 'linear-gradient(135deg, #4dabf7 0%, #51cf66 50%, #ffd43b 100%)',
      sunset: 'linear-gradient(135deg, #f59e0b 0%, #ff6b6b 100%)',
    }
  },
  shadows: {
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  }
};

// Sistema Bilingüe (Español/Inglés)
const TEXTOS = {
  es: {
    hotelName: 'Hotel Pacific Reef',
    tagline: 'Tu refugio en el arrecife del Pacífico',
    iniciarSesion: 'Iniciar Sesión',
    cerrarSesion: 'Cerrar Sesión',
    reservarAhora: 'Reservar Ahora',
    bienvenida: 'Bienvenido al Hotel Pacific Reef',
    descripcion: 'Sistema de gestión de reservas con pago seguro del 30% de anticipo y generación de comprobantes digitales con código QR.',
    habitaciones: 'Habitaciones Disponibles',
    precio: 'Precio por noche',
    disponible: 'Disponible',
    reservar: 'Reservar',
    pagar: 'Pagar Anticipo (30%)',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    huespedes: 'Huéspedes',
    buscar: 'Buscar Habitaciones',
    procesandoPago: 'Procesando pago...',
    reservaConfirmada: 'Reserva Confirmada',
    codigoReserva: 'Código de Reserva',
    comprobante: 'Descargar Comprobante QR',
    nuevaReserva: 'Nueva Reserva'
  },
  en: {
    hotelName: 'Hotel Pacific Reef',
    tagline: 'Your Pacific Reef Refuge',
    iniciarSesion: 'Sign In',
    cerrarSesion: 'Sign Out',
    reservarAhora: 'Book Now',
    bienvenida: 'Welcome to Hotel Pacific Reef',
    descripcion: 'Reservation management system with secure 30% deposit payment and digital receipt generation with QR code.',
    habitaciones: 'Available Rooms',
    precio: 'Price per night',
    disponible: 'Available',
    reservar: 'Book',
    pagar: 'Pay Deposit (30%)',
    checkIn: 'Check-in',
    checkOut: 'Check-out',
    huespedes: 'Guests',
    buscar: 'Search Rooms',
    procesandoPago: 'Processing payment...',
    reservaConfirmada: 'Booking Confirmed',
    codigoReserva: 'Booking Code',
    comprobante: 'Download QR Receipt',
    nuevaReserva: 'New Booking'
  }
};

// Datos de habitaciones demo
const HABITACIONES: Habitacion[] = [
  {
    id: 1,
    nombre: 'Habitación Coral',
    precio: 85,
    descripcion: 'Habitación estándar con vista al jardín tropical y aire acondicionado',
    imagen: '🪸',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'],
    tipo: 'standard',
    capacidad: 2,
    metrosCuadrados: 25
  },
  {
    id: 2,
    nombre: 'Suite Ocean View',
    precio: 150,
    descripcion: 'Suite de lujo con vista panorámica al océano Pacífico y jacuzzi privado',
    imagen: '🌊',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Jacuzzi', 'Balcón', 'Room Service'],
    tipo: 'suite',
    capacidad: 4,
    metrosCuadrados: 50
  },
  {
    id: 3,
    nombre: 'Cabaña Reef',
    precio: 200,
    descripcion: 'Cabaña privada frente al arrecife con cocina completa y terraza',
    imagen: '🏖️',
    disponible: false,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Cocina', 'Terraza Privada', 'Parrilla'],
    tipo: 'cabaña',
    capacidad: 6,
    metrosCuadrados: 75
  },
  {
    id: 4,
    nombre: 'Habitación Estándar Plus',
    precio: 95,
    descripcion: 'Habitación estándar renovada con vista parcial al mar',
    imagen: '🏨',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Caja Fuerte'],
    tipo: 'standard',
    capacidad: 2,
    metrosCuadrados: 28
  },
  {
    id: 5,
    nombre: 'Suite Familiar',
    precio: 180,
    descripcion: 'Suite espaciosa ideal para familias con dos dormitorios separados',
    imagen: '👨‍👩‍👧‍👦',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Kitchenette', 'Sala de Estar', 'Balcón'],
    tipo: 'suite',
    capacidad: 6,
    metrosCuadrados: 65
  },
  {
    id: 6,
    nombre: 'Habitación Económica',
    precio: 65,
    descripcion: 'Habitación cómoda y económica con todas las comodidades básicas',
    imagen: '🛏️',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado'],
    tipo: 'standard',
    capacidad: 2,
    metrosCuadrados: 20
  },
  {
    id: 7,
    nombre: 'Cabaña Luna de Miel',
    precio: 250,
    descripcion: 'Cabaña romántica con jacuzzi privado y vista al atardecer',
    imagen: '💕',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Jacuzzi Privado', 'Champagne', 'Pétalos de Rosa'],
    tipo: 'cabaña',
    capacidad: 2,
    metrosCuadrados: 45
  },
  {
    id: 8,
    nombre: 'Suite Presidencial',
    precio: 350,
    descripcion: 'La suite más lujosa con vista panorámica de 360° y servicio de mayordomo',
    imagen: '👑',
    disponible: false,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Jacuzzi', 'Mayordomo', 'Bar Privado', 'Terraza'],
    tipo: 'suite',
    capacidad: 4,
    metrosCuadrados: 100
  },
  {
    id: 9,
    nombre: 'Habitación Triple',
    precio: 120,
    descripcion: 'Habitación amplia con tres camas individuales, ideal para grupos',
    imagen: '🛏️🛏️🛏️',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Escritorio'],
    tipo: 'standard',
    capacidad: 3,
    metrosCuadrados: 35
  },
  {
    id: 10,
    nombre: 'Cabaña Aventura',
    precio: 175,
    descripcion: 'Cabaña equipada para aventureros con acceso directo a senderos',
    imagen: '🥾',
    disponible: true,
    servicios: ['WiFi', 'TV', 'Aire Acondicionado', 'Equipo de Snorkel', 'Bicicletas', 'Cooler'],
    tipo: 'cabaña',
    capacidad: 4,
    metrosCuadrados: 40
  }
];

// Componentes
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'success';
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  style = {},
  disabled = false 
}) => {
  const styles = {
    primary: {
      background: DESIGN_TOKENS.colors.gradients.ocean,
      color: 'white',
      border: 'none'
    },
    outline: {
      background: 'transparent',
      color: DESIGN_TOKENS.colors.primary,
      border: `2px solid ${DESIGN_TOKENS.colors.primary}`
    },
    success: {
      background: DESIGN_TOKENS.colors.success,
      color: 'white',
      border: 'none'
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 24px',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '500',
        fontSize: '1rem',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1,
        ...styles[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
};

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, style = {} }) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: DESIGN_TOKENS.shadows.lg,
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      ...style
    }}
  >
    {children}
  </div>
);

interface HabitacionCardProps {
  habitacion: Habitacion;
  idioma: 'es' | 'en';
  onReservar: (habitacion: Habitacion) => void;
}

const HabitacionCard: React.FC<HabitacionCardProps> = ({ habitacion, idioma, onReservar }) => {
  const t = TEXTOS[idioma];

  const tipoTexto = {
    'es': {
      'standard': 'Estándar',
      'suite': 'Suite',
      'cabaña': 'Cabaña'
    },
    'en': {
      'standard': 'Standard',
      'suite': 'Suite',
      'cabaña': 'Cabin'
    }
  };
  
  return (
    <Card style={{ margin: '16px 0' }}>
      <div style={{
        background: DESIGN_TOKENS.colors.gradients.reef,
        padding: '24px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>
          {habitacion.imagen}
        </div>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
          {habitacion.nombre}
        </h3>
        <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
          {tipoTexto[idioma][habitacion.tipo]} • {habitacion.capacidad} {idioma === 'es' ? 'personas' : 'guests'}
        </p>
      </div>
      
      <div style={{ padding: '24px' }}>
        <p style={{ color: '#64748b', marginBottom: '16px' }}>
          {habitacion.descripcion}
        </p>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
            📐 {habitacion.metrosCuadrados} m² • 👥 {habitacion.capacidad} {idioma === 'es' ? 'personas' : 'guests'}
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px',
          marginBottom: '16px'
        }}>
          {habitacion.servicios.slice(0, 4).map((servicio, index) => (
            <span
              key={index}
              style={{
                backgroundColor: `${DESIGN_TOKENS.colors.primary}20`,
                color: DESIGN_TOKENS.colors.primary,
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              {servicio}
            </span>
          ))}
          {habitacion.servicios.length > 4 && (
            <span style={{
              color: '#64748b',
              fontSize: '0.8rem',
              padding: '4px 8px'
            }}>
              +{habitacion.servicios.length - 4} más
            </span>
          )}
        </div>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: DESIGN_TOKENS.colors.primary }}>
              ${habitacion.precio}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
              {t.precio}
            </div>
          </div>
          <div style={{
            color: habitacion.disponible ? DESIGN_TOKENS.colors.success : '#ef4444',
            fontWeight: '500'
          }}>
            {habitacion.disponible ? '✅ ' + t.disponible : '❌ Ocupada'}
          </div>
        </div>
        
        {habitacion.disponible && (
          <Button
            style={{ width: '100%' }}
            onClick={() => onReservar(habitacion)}
          >
            📅 {t.reservar}
          </Button>
        )}
      </div>
    </Card>
  );
};

type Paso = 'consulta' | 'busqueda' | 'pago' | 'comprobante';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [idioma, setIdioma] = useState<'es' | 'en'>('es');
  const [reservaActual, setReservaActual] = useState<Habitacion | null>(null);
  const [paso, setPaso] = useState<Paso>('consulta');
  const [procesandoPago, setProcesandoPago] = useState(false);
  
  const t = TEXTOS[idioma];

  const cambiarIdioma = () => {
    setIdioma(idioma === 'es' ? 'en' : 'es');
  };

  const realizarReserva = (habitacion: Habitacion) => {
    setReservaActual(habitacion);
    setPaso('pago');
  };

  const procesarPago = () => {
    setProcesandoPago(true);
    // Simular procesamiento de pago del 30% de anticipo
    setTimeout(() => {
      setProcesandoPago(false);
      setPaso('comprobante');
    }, 3000);
  };

  const nuevaReserva = () => {
    setPaso('consulta');
    setReservaActual(null);
  };

  if (showLogin) {
    return (
      <div 
        style={{
          minHeight: '100vh',
          background: DESIGN_TOKENS.colors.gradients.reef,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Card style={{ padding: '48px', maxWidth: '400px', width: '90%' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '24px',
            fontSize: '1.5rem'
          }}>
            🔐 {t.iniciarSesion}
          </h2>
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              placeholder={idioma === 'es' ? 'Correo electrónico' : 'Email'}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                marginBottom: '12px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <input
              type="password"
              placeholder={idioma === 'es' ? 'Contraseña' : 'Password'}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e2e8f0',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <Button
            onClick={() => {
              setUser({ name: 'Usuario Demo', email: 'demo@pacificreef.com', role: 'guest' });
              setShowLogin(false);
            }}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            🎉 {idioma === 'es' ? 'Ingresar (Demo)' : 'Sign In (Demo)'}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowLogin(false)}
            style={{ width: '100%' }}
          >
            ← {idioma === 'es' ? 'Volver' : 'Back'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: DESIGN_TOKENS.colors.background,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Header */}
      <header 
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: DESIGN_TOKENS.shadows.md,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              height: '80px' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{
                  background: DESIGN_TOKENS.colors.gradients.ocean,
                  padding: '8px',
                  borderRadius: '16px',
                  boxShadow: DESIGN_TOKENS.shadows.md,
                }}
              >
                <span style={{ fontSize: '32px', color: 'white' }}>🏨</span>
              </div>
              <div>
                <h1 
                  style={{ 
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: 0,
                    color: '#0f172a'
                  }}
                >
                  🏨 {t.hotelName}
                </h1>
                <p 
                  style={{ 
                    color: '#64748b',
                    fontStyle: 'italic',
                    margin: 0,
                    fontSize: '0.9rem'
                  }}
                >
                  {t.tagline}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="outline"
                onClick={cambiarIdioma}
                style={{ marginRight: '12px' }}
              >
                🌐 {idioma === 'es' ? 'EN' : 'ES'}
              </Button>
              
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '500' }}>{user.name}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => setUser(null)}
                  >
                    👋 {t.cerrarSesion}
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowLogin(true)}
                >
                  🔐 {t.iniciarSesion}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 
            style={{ 
              fontSize: '3rem', 
              fontWeight: '700',
              background: DESIGN_TOKENS.colors.gradients.reef,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '16px'
            }}
          >
            {t.bienvenida}
          </h1>
          <p 
            style={{ 
              fontSize: '1.2rem',
              color: '#475569',
              maxWidth: '800px',
              margin: '0 auto 32px',
              lineHeight: '1.6'
            }}
          >
            {t.descripcion}
          </p>
          
          {!user && (
            <Button 
              onClick={() => setShowLogin(true)}
              style={{ fontSize: '1.1rem', padding: '16px 32px' }}
            >
              📅 {t.reservarAhora}
            </Button>
          )}
        </div>

        {/* Sistema de Reservas */}
        {user && (
          <div>
            {paso === 'consulta' && (
              <div>
                {/* Búsqueda Rápida */}
                <Card style={{ marginBottom: '32px' }}>
                  <div 
                    style={{
                      background: DESIGN_TOKENS.colors.gradients.ocean,
                      padding: '24px',
                      color: 'white'
                    }}
                  >
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>
                      🔍 {idioma === 'es' ? 'Consultar Disponibilidad' : 'Check Availability'}
                    </h2>
                  </div>
                  <div style={{ padding: '32px' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '16px',
                      marginBottom: '24px'
                    }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          {t.checkIn}
                        </label>
                        <input
                          type="date"
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          {t.checkOut}
                        </label>
                        <input
                          type="date"
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          fontWeight: '500'
                        }}>
                          {t.huespedes}
                        </label>
                        <select
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0',
                            fontSize: '1rem'
                          }}
                        >
                          <option>1 {idioma === 'es' ? 'Huésped' : 'Guest'}</option>
                          <option>2 {idioma === 'es' ? 'Huéspedes' : 'Guests'}</option>
                          <option>3 {idioma === 'es' ? 'Huéspedes' : 'Guests'}</option>
                          <option>4+ {idioma === 'es' ? 'Huéspedes' : 'Guests'}</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <Button style={{ width: '100%' }}>
                        🔍 {t.buscar}
                      </Button>
                      <Button 
                        variant="outline" 
                        style={{ width: '100%' }}
                        onClick={() => setPaso('busqueda')}
                      >
                        🎛️ {idioma === 'es' ? 'Búsqueda Avanzada' : 'Advanced Search'}
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Lista de Habitaciones Destacadas */}
                <div>
                  <h2 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700',
                    color: '#0f172a',
                    marginBottom: '24px'
                  }}>
                    🏨 {t.habitaciones}
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                    gap: '24px' 
                  }}>
                    {HABITACIONES.filter(h => h.disponible).slice(0, 6).map(habitacion => (
                      <HabitacionCard
                        key={habitacion.id}
                        habitacion={habitacion}
                        idioma={idioma}
                        onReservar={realizarReserva}
                      />
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <Button 
                      variant="outline"
                      onClick={() => setPaso('busqueda')}
                      style={{ fontSize: '1.1rem', padding: '16px 32px' }}
                    >
                      🔍 {idioma === 'es' ? 'Ver todas las habitaciones' : 'View all rooms'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {paso === 'busqueda' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <Button 
                    variant="outline"
                    onClick={() => setPaso('consulta')}
                    style={{ marginBottom: '16px' }}
                  >
                    ← {idioma === 'es' ? 'Volver al inicio' : 'Back to home'}
                  </Button>
                </div>
                <SearchRooms
                  habitaciones={HABITACIONES}
                  idioma={idioma}
                  onReservar={realizarReserva}
                  designTokens={DESIGN_TOKENS}
                  textos={TEXTOS}
                />
              </div>
            )}

            {paso === 'pago' && reservaActual && (
              <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div 
                  style={{
                    background: DESIGN_TOKENS.colors.gradients.sunset,
                    padding: '24px',
                    color: 'white',
                    textAlign: 'center'
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                    💳 {t.pagar}
                  </h2>
                </div>
                <div style={{ padding: '32px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <h3>{reservaActual.nombre}</h3>
                    <p>Total: ${reservaActual.precio}</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: DESIGN_TOKENS.colors.primary }}>
                      Anticipo (30%): ${Math.round(reservaActual.precio * 0.3)}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <h4>{idioma === 'es' ? 'Datos de Tarjeta (Sandbox)' : 'Card Details (Sandbox)'}</h4>
                    <input
                      type="text"
                      placeholder="**** **** **** 1234"
                      defaultValue="4111 1111 1111 1111"
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '12px',
                        borderRadius: '8px',
                        border: '2px solid #e2e8f0',
                      }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        defaultValue="12/25"
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: '2px solid #e2e8f0',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        defaultValue="123"
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          border: '2px solid #e2e8f0',
                        }}
                      />
                    </div>
                  </div>
                  
                  <Button
                    style={{ width: '100%' }}
                    onClick={procesarPago}
                    disabled={procesandoPago}
                  >
                    {procesandoPago ? 
                      `⏳ ${t.procesandoPago}` : 
                      `💳 Pagar $${Math.round(reservaActual.precio * 0.3)}`
                    }
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setPaso('consulta')}
                    style={{ width: '100%', marginTop: '12px' }}
                    disabled={procesandoPago}
                  >
                    ← {idioma === 'es' ? 'Volver' : 'Back'}
                  </Button>
                </div>
              </Card>
            )}

            {paso === 'comprobante' && reservaActual && (
              <Card style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <div 
                  style={{
                    background: DESIGN_TOKENS.colors.gradients.reef,
                    padding: '24px',
                    color: 'white'
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
                    ✅ {t.reservaConfirmada}
                  </h2>
                </div>
                <div style={{ padding: '32px' }}>
                  <div style={{ fontSize: '96px', marginBottom: '24px' }}>
                    📱
                  </div>
                  
                  <h3>{reservaActual.nombre}</h3>
                  <p>
                    {t.codigoReserva}: 
                    <strong> PR-{Date.now().toString().slice(-6)}</strong>
                  </p>
                  <p>
                    {idioma === 'es' ? 'Pago realizado:' : 'Payment made:'} 
                    <strong> ${Math.round(reservaActual.precio * 0.3)}</strong>
                  </p>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
                    {idioma === 'es' ? 
                      'Se ha enviado el comprobante con código QR a tu email.' : 
                      'QR code receipt has been sent to your email.'
                    }
                  </p>
                  
                  <Button
                    variant="success"
                    style={{ width: '100%', marginBottom: '16px' }}
                  >
                    📄 {t.comprobante}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={nuevaReserva}
                  >
                    🔄 {t.nuevaReserva}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Información del Hotel para usuarios no logueados */}
        {!user && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '32px',
            marginTop: '48px'
          }}>
            <Card style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏖️</div>
              <h3>{idioma === 'es' ? 'Ubicación Privilegiada' : 'Prime Location'}</h3>
              <p>{idioma === 'es' ? 'Frente al arrecife del Pacífico con acceso directo a la playa' : 'Facing the Pacific Reef with direct beach access'}</p>
            </Card>
            
            <Card style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h3>{idioma === 'es' ? 'Pago Seguro' : 'Secure Payment'}</h3>
              <p>{idioma === 'es' ? 'Pago del 30% de anticipo con pasarela segura en modo sandbox' : '30% deposit payment with secure gateway in sandbox mode'}</p>
            </Card>
            
            <Card style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
              <h3>{idioma === 'es' ? 'Comprobante Digital' : 'Digital Receipt'}</h3>
              <p>{idioma === 'es' ? 'Recibe tu comprobante con código QR al instante por email' : 'Get your QR code receipt instantly via email'}</p>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
