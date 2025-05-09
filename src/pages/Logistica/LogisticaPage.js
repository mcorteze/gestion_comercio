import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Space, Tag, Radio } from 'antd';

const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const formatDateTime = (text) => {
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  const formattedDate = `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return `${formattedDate}, ${formattedTime}`;
};


const formatDateTime_Simple = (text) => {
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  const formattedDate = `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  return `${formattedDate}`;
};

const LogisticaPage = () => {
  const [operaciones, setOperaciones] = useState([]);
  const [filteredOperaciones, setFilteredOperaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedState, setSelectedState] = useState(''); // Estado seleccionado para filtrar

  useEffect(() => {
    const fetchOperaciones = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/operaciones');
        setOperaciones(response.data);
        setFilteredOperaciones(response.data);
      } catch (err) {
        setError('Error al obtener las operaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchOperaciones();
  }, []);

  const handleSearch = (value) => {
    const query = normalizeText(value);

    const filtered = operaciones.filter((op) => {
      const numeroOrden = normalizeText(op.numero_orden_compra || '');
      const numeroFactura = normalizeText(op.numero_factura_proveedor || '');
      return numeroOrden.includes(query) || numeroFactura.includes(query);
    });

    setFilteredOperaciones(filtered);
    setSearchText(value.trim());
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const filteredByState = (state) => {
    if (!state) return operaciones; // Si no hay filtro, mostrar todas las operaciones
    return operaciones.filter((op) => normalizeText(op.estado).includes(normalizeText(state)));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tipo Transporte', dataIndex: 'tipo_transporte', key: 'tipo_transporte' },
    { title: 'Número BL/AWB/CRT', dataIndex: 'numero_bl_awb_crt', key: 'numero_bl_awb_crt' },
    { title: 'Puerto Embarque', dataIndex: 'puerto_embarque', key: 'puerto_embarque' },
    { title: 'Puerto Destino', dataIndex: 'puerto_destino', key: 'puerto_destino' },
    { title: 'Fecha ETD', dataIndex: 'f_etd', key: 'f_etd', render: formatDateTime_Simple },
    { title: 'Fecha ETA', dataIndex: 'f_eta', key: 'f_eta', render: formatDateTime_Simple },
    { title: 'Fecha Envío Dctos Intercomex', dataIndex: 'f_envio_dctos_intercomex', key: 'f_envio_dctos_intercomex', render: formatDateTime_Simple },
    { title: 'Fecha Pago Proveedor', dataIndex: 'f_pago_proveedor', key: 'f_pago_proveedor', render: formatDateTime_Simple },
    { title: 'Fecha Pago Derechos', dataIndex: 'f_pago_derechos', key: 'f_pago_derechos', render: formatDateTime_Simple },
    { title: 'Días Libres', dataIndex: 'dias_libres', key: 'dias_libres' },
    { title: 'Condición Pago Días', dataIndex: 'condicion_pago_dias', key: 'condicion_pago_dias' },
  ];
  

  // Extraemos todos los estados únicos de las operaciones
  const estados = [...new Set(operaciones.map((op) => op.estado))];

  const filteredData = filteredByState(selectedState); // Filtrar operaciones por estado seleccionado

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="page-full">
      <h1>Logística de operaciones</h1>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por orden de compra o factura"
          enterButton="Buscar"
          onSearch={handleSearch}
          allowClear
        />
        {/* Segmentador de estados */}
        <Radio.Group onChange={handleStateChange} value={selectedState}>
          <Radio.Button value="">Todos</Radio.Button>
          {estados.map((estado) => (
            <Radio.Button key={estado} value={estado}>
              {estado}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Space>
      <Table dataSource={filteredData} columns={columns} rowKey="id" scroll={{ x: 'max-content' }} />
    </div>
  );
};

export default LogisticaPage;
