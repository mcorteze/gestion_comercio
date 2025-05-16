import React, { useState } from 'react';
import { List, Space, Input } from 'antd';
import {
  FiClock,
  FiPackage,
  FiTruck,
  FiGlobe,
  FiHome,
  FiDollarSign,
  FiCheckCircle,
  FiList,
} from 'react-icons/fi';
import './EstadoPanel.css';

const { Search } = Input;

const iconMap = {
  'Esperando confirmación': <FiClock />,
  'En preparación': <FiPackage />,
  'En tránsito internacional': <FiGlobe />,
  'Proceso de internación': <FiList />,
  'En tránsito nacional': <FiTruck />,
  'Entregado a bodega': <FiHome />,
  'Proceso de costeo': <FiDollarSign />,
  'Completado': <FiCheckCircle />,
  null: <FiList />, // "Todos"
};

const estadoOrden = [
  'Esperando confirmación',
  'En preparación',
  'En tránsito internacional',
  'Proceso de internación',
  'En tránsito nacional',
  'Entregado a bodega',
  'Proceso de costeo',
  'Completado',
];

const EstadoPanel = ({ operaciones, estadoSeleccionado, onEstadoSeleccionado }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar por número de orden de compra o número BL/AWB/CRT
  const operacionesFiltradas = operaciones.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.numero_orden_compra?.toLowerCase().includes(term) ||
      item.numero_bl_awb_crt?.toLowerCase().includes(term)
    );
  });

  const estadosConConteo = operacionesFiltradas.reduce((acc, item) => {
    acc[item.estado] = (acc[item.estado] || 0) + 1;
    return acc;
  }, {});

  const estadoItems = [
    { estado: null, label: `Todos (${operacionesFiltradas.length})` },
    ...estadoOrden
      .filter((estado) => estadosConConteo[estado])
      .map((estado) => ({
        estado,
        label: `${estado} (${estadosConConteo[estado]})`,
      })),
  ];

  return (
    <div>
      {/* Cuadro de búsqueda */}
      <div style={{ padding: '0px', marginBottom: '8px' }}>
        <Search
          placeholder="Buscar por N° orden o BL/AWB/CRT"
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
        />
      </div>

      <List
        className="estado-list"
        dataSource={estadoItems}
        renderItem={(item) => {
          const estadoLabel = item.estado || 'Todos';
          const icon = iconMap[estadoLabel] || <FiList />;
          const count = item.label.match(/\((\d+)\)/)?.[1] || 0;

          return (
            <List.Item
              className={`estado-item ${estadoSeleccionado === item.estado ? 'estado-item-activo' : ''}`}
              onClick={() => onEstadoSeleccionado(item.estado)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <Space>
                {icon}
                <span>{estadoLabel}</span>
              </Space>
              <strong style={{ color: '#51000d' }}>{count}</strong>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default EstadoPanel;
