import React, { useState, useMemo } from 'react';

// Interfaces
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

interface SearchFilters {
  fechaInicio: string;
  fechaFin: string;
  huespedes: number;
  precioMin: number;
  precioMax: number;
  servicios: string[];
  tipo: string;
  soloDisponibles: boolean;
}

interface SearchRoomsProps {
  habitaciones: Habitacion[];
  idioma: 'es' | 'en';
  onReservar: (habitacion: Habitacion) => void;
  designTokens: any;
  textos: any;
}

// Componente Button reutilizable
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'success' | 'secondary';
  style?: React.CSSProperties;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  style = {},
  disabled = false,
  size = 'md'
}) => {
  const designTokens = {
    colors: {
      primary: '#1e40af',
      secondary: '#0891b2',
      accent: '#f59e0b',
      success: '#059669',
      gradients: {
        ocean: 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%)',
        reef: 'linear-gradient(135deg, #4dabf7 0%, #51cf66 50%, #ffd43b 100%)',
        sunset: 'linear-gradient(135deg, #f59e0b 0%, #ff6b6b 100%)',
      }
    }
  };

  const styles = {
    primary: {
      background: designTokens.colors.gradients.ocean,
      color: 'white',
      border: 'none'
    },
    outline: {
      background: 'transparent',
      color: designTokens.colors.primary,
      border: `2px solid ${designTokens.colors.primary}`
    },
    success: {
      background: designTokens.colors.success,
      color: 'white',
      border: 'none'
    },
    secondary: {
      background: designTokens.colors.secondary,
      color: 'white',
      border: 'none'
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '0.875rem' },
    md: { padding: '12px 24px', fontSize: '1rem' },
    lg: { padding: '16px 32px', fontSize: '1.125rem' }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.6 : 1,
        ...styles[variant],
        ...sizes[size],
        ...style
      }}
    >
      {children}
    </button>
  );
};

// Componente Card reutilizable
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ 
  children, 
  style = {} 
}) => (
  <div
    style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      ...style
    }}
  >
    {children}
  </div>
);

// Componente principal SearchRooms
const SearchRooms: React.FC<SearchRoomsProps> = ({
  habitaciones,
  idioma,
  onReservar,
  designTokens,
  textos
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
    precioMin: 0,
    precioMax: 500,
    servicios: [],
    tipo: '',
    soloDisponibles: true
  });

  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const t = textos[idioma];

  // Lista de servicios únicos
  const serviciosDisponibles = useMemo(() => {
    const servicios = new Set<string>();
    habitaciones.forEach(hab => hab.servicios.forEach(servicio => servicios.add(servicio)));
    return Array.from(servicios);
  }, [habitaciones]);

  // Habitaciones filtradas
  const habitacionesFiltradas = useMemo(() => {
    return habitaciones.filter(habitacion => {
      // Filtro por disponibilidad
      if (filters.soloDisponibles && !habitacion.disponible) return false;
      
      // Filtro por precio
      if (habitacion.precio < filters.precioMin || habitacion.precio > filters.precioMax) return false;
      
      // Filtro por capacidad
      if (habitacion.capacidad < filters.huespedes) return false;
      
      // Filtro por tipo
      if (filters.tipo && habitacion.tipo !== filters.tipo) return false;
      
      // Filtro por servicios
      if (filters.servicios.length > 0) {
        const tieneServicios = filters.servicios.every(servicio => 
          habitacion.servicios.includes(servicio)
        );
        if (!tieneServicios) return false;
      }
      
      return true;
    });
  }, [habitaciones, filters]);

  const handleServicioChange = (servicio: string) => {
    setFilters(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicio)
        ? prev.servicios.filter(s => s !== servicio)
        : [...prev.servicios, servicio]
    }));
  };

  const limpiarFiltros = () => {
    setFilters({
      fechaInicio: '',
      fechaFin: '',
      huespedes: 1,
      precioMin: 0,
      precioMax: 500,
      servicios: [],
      tipo: '',
      soloDisponibles: true
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header de búsqueda */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: designTokens.colors.gradients.reef,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '16px'
        }}>
          🔍 {idioma === 'es' ? 'Buscar Habitaciones' : 'Search Rooms'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
          {idioma === 'es' 
            ? 'Encuentra la habitación perfecta para tu estadía' 
            : 'Find the perfect room for your stay'
          }
        </p>
      </div>

      {/* Barra de búsqueda principal */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{
          background: designTokens.colors.gradients.ocean,
          padding: '24px',
          color: 'white'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                📅 {t.checkIn}
              </label>
              <input
                type="date"
                value={filters.fechaInicio}
                onChange={(e) => setFilters(prev => ({ ...prev, fechaInicio: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                📅 {t.checkOut}
              </label>
              <input
                type="date"
                value={filters.fechaFin}
                onChange={(e) => setFilters(prev => ({ ...prev, fechaFin: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                👥 {t.huespedes}
              </label>
              <select
                value={filters.huespedes}
                onChange={(e) => setFilters(prev => ({ ...prev, huespedes: parseInt(e.target.value) }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '1rem'
                }}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? (idioma === 'es' ? 'Huésped' : 'Guest') : (idioma === 'es' ? 'Huéspedes' : 'Guests')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                variant="secondary"
                style={{ width: '100%' }}
              >
                🎛️ {idioma === 'es' ? 'Filtros' : 'Filters'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Panel de filtros avanzados */}
      {mostrarFiltros && (
        <Card style={{ marginBottom: '24px' }}>
          <div style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ margin: 0, color: designTokens.colors.primary }}>
                🎛️ {idioma === 'es' ? 'Filtros Avanzados' : 'Advanced Filters'}
              </h3>
              <Button size="sm" variant="outline" onClick={limpiarFiltros}>
                🗑️ {idioma === 'es' ? 'Limpiar' : 'Clear'}
              </Button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              {/* Rango de precios */}
              <div>
                <h4 style={{ marginBottom: '12px', color: '#374151' }}>
                  💰 {idioma === 'es' ? 'Rango de Precio' : 'Price Range'}
                </h4>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.precioMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, precioMin: parseInt(e.target.value) || 0 }))}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '2px solid #e2e8f0',
                      width: '80px'
                    }}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.precioMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, precioMax: parseInt(e.target.value) || 500 }))}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '2px solid #e2e8f0',
                      width: '80px'
                    }}
                  />
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                  ${filters.precioMin} - ${filters.precioMax}
                </div>
              </div>

              {/* Tipo de habitación */}
              <div>
                <h4 style={{ marginBottom: '12px', color: '#374151' }}>
                  🏨 {idioma === 'es' ? 'Tipo de Habitación' : 'Room Type'}
                </h4>
                <select
                  value={filters.tipo}
                  onChange={(e) => setFilters(prev => ({ ...prev, tipo: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <option value="">{idioma === 'es' ? 'Todos los tipos' : 'All types'}</option>
                  <option value="standard">{idioma === 'es' ? 'Estándar' : 'Standard'}</option>
                  <option value="suite">Suite</option>
                  <option value="cabaña">{idioma === 'es' ? 'Cabaña' : 'Cabin'}</option>
                </select>
              </div>

              {/* Servicios */}
              <div style={{ gridColumn: '1 / -1' }}>
                <h4 style={{ marginBottom: '12px', color: '#374151' }}>
                  ⭐ {idioma === 'es' ? 'Servicios' : 'Services'}
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {serviciosDisponibles.map(servicio => (
                    <label
                      key={servicio}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: '2px solid #e2e8f0',
                        backgroundColor: filters.servicios.includes(servicio) ? designTokens.colors.primary : 'white',
                        color: filters.servicios.includes(servicio) ? 'white' : '#374151',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={filters.servicios.includes(servicio)}
                        onChange={() => handleServicioChange(servicio)}
                        style={{ display: 'none' }}
                      />
                      {servicio}
                    </label>
                  ))}
                </div>
              </div>

              {/* Solo disponibles */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={filters.soloDisponibles}
                    onChange={(e) => setFilters(prev => ({ ...prev, soloDisponibles: e.target.checked }))}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <span style={{ fontWeight: '500' }}>
                    ✅ {idioma === 'es' ? 'Solo habitaciones disponibles' : 'Only available rooms'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Resultados */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{ color: '#1f2937', margin: 0 }}>
            📋 {habitacionesFiltradas.length} {idioma === 'es' ? 'habitaciones encontradas' : 'rooms found'}
          </h2>
          <select
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '2px solid #e2e8f0'
            }}
          >
            <option>{idioma === 'es' ? 'Ordenar por precio' : 'Sort by price'}</option>
            <option>{idioma === 'es' ? 'Precio: menor a mayor' : 'Price: low to high'}</option>
            <option>{idioma === 'es' ? 'Precio: mayor a menor' : 'Price: high to low'}</option>
          </select>
        </div>

        {/* Lista de habitaciones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
        }}>
          {habitacionesFiltradas.map(habitacion => (
            <HabitacionCard
              key={habitacion.id}
              habitacion={habitacion}
              idioma={idioma}
              onReservar={onReservar}
              designTokens={designTokens}
              textos={textos}
            />
          ))}
        </div>

        {habitacionesFiltradas.length === 0 && (
          <Card style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ color: '#64748b' }}>
              {idioma === 'es' 
                ? 'No se encontraron habitaciones' 
                : 'No rooms found'
              }
            </h3>
            <p style={{ color: '#9ca3af' }}>
              {idioma === 'es' 
                ? 'Intenta ajustar tus filtros de búsqueda' 
                : 'Try adjusting your search filters'
              }
            </p>
            <Button onClick={limpiarFiltros} style={{ marginTop: '16px' }}>
              🗑️ {idioma === 'es' ? 'Limpiar filtros' : 'Clear filters'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

// Componente HabitacionCard mejorado
const HabitacionCard: React.FC<{
  habitacion: Habitacion;
  idioma: 'es' | 'en';
  onReservar: (habitacion: Habitacion) => void;
  designTokens: any;
  textos: any;
}> = ({ habitacion, idioma, onReservar, designTokens, textos }) => {
  const t = textos[idioma];

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
    <Card style={{ height: 'fit-content' }}>
      <div style={{
        background: designTokens.colors.gradients.reef,
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
        <p style={{ color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
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
          gap: '6px',
          marginBottom: '16px'
        }}>
          {habitacion.servicios.slice(0, 4).map((servicio, index) => (
            <span
              key={index}
              style={{
                backgroundColor: `${designTokens.colors.primary}15`,
                color: designTokens.colors.primary,
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}
            >
              {servicio}
            </span>
          ))}
          {habitacion.servicios.length > 4 && (
            <span style={{
              color: '#64748b',
              fontSize: '0.75rem',
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
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: designTokens.colors.primary }}>
              ${habitacion.precio}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {t.precio}
            </div>
          </div>
          <div style={{
            padding: '6px 12px',
            borderRadius: '20px',
            backgroundColor: habitacion.disponible ? '#f0fdf4' : '#fef2f2',
            color: habitacion.disponible ? '#166534' : '#dc2626',
            fontSize: '0.8rem',
            fontWeight: '500'
          }}>
            {habitacion.disponible ? '✅ ' + t.disponible : '❌ Ocupada'}
          </div>
        </div>
        
        {habitacion.disponible ? (
          <Button
            style={{ width: '100%' }}
            onClick={() => onReservar(habitacion)}
          >
            📅 {t.reservar}
          </Button>
        ) : (
          <Button
            disabled
            style={{ width: '100%' }}
          >
            🚫 {idioma === 'es' ? 'No disponible' : 'Not available'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SearchRooms;