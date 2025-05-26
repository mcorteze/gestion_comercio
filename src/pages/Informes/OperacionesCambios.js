import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Space, message } from 'antd';

const normalizeText = (text) => {
  return text?.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.toLowerCase().trim() || '';
};

const formatDateTime_Simple = (text) => {
  if (!text) return '—';
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};

const OperacionesCambios = () => {
  const [operaciones, setOperaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3001/api/operaciones_ultimamodificacion');
        setOperaciones(res.data);
      } catch (e) {
        setError('Error al cargar datos');
        message.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredOperaciones = operaciones.filter((op) => {
    const q = normalizeText(searchText);
    return (
      normalizeText(op.numero_orden_compra || '').includes(q) ||
      normalizeText(op.numero_bl_awb_crt || '').includes(q)
    );
  });

  const hasChanges = (op) => op.tiene_cambio_final === 'Sí';

  const formatDateTime_MMDDYYYY_hhmmss = (text) => {
    if (!text) return '—';
    const date = new Date(text);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} - ${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Número Orden Compra',
      dataIndex: 'numero_orden_compra',
      key: 'numero_orden_compra',
      sorter: (a, b) => (a.numero_orden_compra || '').localeCompare(b.numero_orden_compra || ''),
    },
    {
      title: 'Número BL AWB CRT',
      dataIndex: 'numero_bl_awb_crt',
      key: 'numero_bl_awb_crt',
      sorter: (a, b) => (a.numero_bl_awb_crt || '').localeCompare(b.numero_bl_awb_crt || ''),
    },
    {
      title: 'Proveedor',
      dataIndex: 'proveedor_nombre',
      key: 'proveedor_nombre',
      sorter: (a, b) => (a.proveedor_nombre || '').localeCompare(b.proveedor_nombre || ''),
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente_nombre',
      key: 'cliente_nombre',
      sorter: (a, b) => (a.cliente_nombre || '').localeCompare(b.cliente_nombre || ''),
    },
    {
      title: 'Fecha ETA',
      dataIndex: 'f_eta',
      key: 'f_eta',
      render: formatDateTime_Simple,
      sorter: (a, b) => new Date(a.f_eta) - new Date(b.f_eta),
    },
    {
      title: 'Última Modificación Operación',
      dataIndex: 'ultima_modificacion_operacion',
      key: 'ultima_modificacion_operacion',
      render: formatDateTime_MMDDYYYY_hhmmss,
      sorter: (a, b) => new Date(a.ultima_modificacion_operacion) - new Date(b.ultima_modificacion_operacion),
    },
    {
      title: 'Última Modificación Productos',
      dataIndex: 'ultima_modificacion_productos',
      key: 'ultima_modificacion_productos',
      render: formatDateTime_MMDDYYYY_hhmmss,
      sorter: (a, b) => new Date(a.ultima_modificacion_productos) - new Date(b.ultima_modificacion_productos),
    },
    {
      title: 'Cambios',
      dataIndex: 'tiene_cambio_final',
      key: 'tiene_cambio_final',
      render: (text) => (text === 'Sí' ? <span style={{ color: 'red', fontWeight: 'bold' }}>Sí</span> : 'No'),
      filters: [
        { text: 'Sí', value: 'Sí' },
        { text: 'No', value: 'No' },
      ],
      onFilter: (value, record) => record.tiene_cambio_final === value,
      width: 80,
    },


  ];

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por número orden o BL"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
          style={{ width: 300 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={filteredOperaciones}
        rowKey="id"
        pagination={{ pageSize: 15 }}
      />
    </div>
  );
};

export default OperacionesCambios;
