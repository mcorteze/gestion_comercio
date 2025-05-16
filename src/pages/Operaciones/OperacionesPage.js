import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Input, Space, Tag, Select, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';
import CrearOperacionModal from '../../components/Operaciones/CrearOperacionModal'; // Ajusta path si es necesario

const { RangePicker } = DatePicker;

const normalizeText = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const formatDateTime = (text) => {
  if (!text) return '';
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  const formattedDate = `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
  const formattedTime = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  return `${formattedDate}, ${formattedTime}`;
};

const formatDateTime_Simple = (text) => {
  if (!text) return '';
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};

const OperacionesPage = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  const [operaciones, setOperaciones] = useState([]);
  const [filteredOperaciones, setFilteredOperaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    numero_orden_compra: '',
    carpeta_onedrive: '',
    numero_factura_proveedor: '',
    incoterm: '',
    numero_bl_awb_crt: '',
    condicion_pago_dias: '',
    nombre_cliente: '',
    nombre_proveedor: '',
    estado: '',
    tipo_transporte: '',
    puerto_destino: '',
    f_envio_soc: null,
    updated_at: null,
    f_eta: null,
  });

  const handleCreateOperacion = (data) => {
    console.log('Crear operación:', data);
    setCreating(true);
    // Simula creación async
    setTimeout(() => {
      setCreating(false);
      setModalVisible(false);
    }, 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operacionesRes, clientesRes, proveedoresRes] = await Promise.all([
          axios.get('http://localhost:3001/api/operaciones'),
          axios.get('http://localhost:3001/api/clientes'),
          axios.get('http://localhost:3001/api/proveedores'),
        ]);

        const operacionesRaw = operacionesRes.data;
        const clientes = clientesRes.data;
        const proveedores = proveedoresRes.data;

        const operacionesWithNames = operacionesRaw.map((op) => {
          const cliente = clientes.find((c) => c.id === op.cliente_id);
          const proveedor = proveedores.find((p) => p.id === op.proveedor_id);
          return {
            ...op,
            nombre_cliente: cliente ? cliente.nombre : 'N/A',
            nombre_proveedor: proveedor ? proveedor.nombre : 'N/A',
          };
        });

        setOperaciones(operacionesWithNames);
        setFilteredOperaciones(operacionesWithNames);
      } catch (err) {
        console.error(err);
        setError('Error al obtener datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...operaciones];

      Object.entries(filters).forEach(([key, value]) => {
        if (!value || value === '') return;

        if (Array.isArray(value)) {
          filtered = filtered.filter((op) => {
            const date = dayjs(op[key]);
            // Permite fecha exacta (>= desde y <= hasta)
            return date.isSameOrAfter(value[0], 'day') && date.isSameOrBefore(value[1], 'day');
          });
        } else {
          filtered = filtered.filter((op) =>
            normalizeText(op[key] || '').includes(normalizeText(value))
          );
        }
      });

      setFilteredOperaciones(filtered);
    };

    applyFilters();
  }, [filters, operaciones]);

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Orden Compra', dataIndex: 'numero_orden_compra', key: 'numero_orden_compra' },
    { title: 'Carpeta OneDrive', dataIndex: 'carpeta_onedrive', key: 'carpeta_onedrive' },
    { title: 'Cliente', dataIndex: 'nombre_cliente', key: 'nombre_cliente' },
    { title: 'Proveedor', dataIndex: 'nombre_proveedor', key: 'nombre_proveedor' },
    { title: 'Fecha Envío SOC', dataIndex: 'f_envio_soc', key: 'f_envio_soc', render: formatDateTime_Simple },
    { title: 'Factura Proveedor', dataIndex: 'numero_factura_proveedor', key: 'numero_factura_proveedor' },
    { title: 'Incoterm', dataIndex: 'incoterm', key: 'incoterm' },
    { title: 'Estado', dataIndex: 'estado', key: 'estado' },
    { title: 'Tipo Transporte', dataIndex: 'tipo_transporte', key: 'tipo_transporte' },
    { title: 'Puerto Destino', dataIndex: 'puerto_destino', key: 'puerto_destino' },
    { title: 'N° BL/AWB/CRT', dataIndex: 'numero_bl_awb_crt', key: 'numero_bl_awb_crt' },
    { title: 'Condición Pago Días', dataIndex: 'condicion_pago_dias', key: 'condicion_pago_dias' },
    { title: 'ETA', dataIndex: 'f_eta', key: 'f_eta', render: formatDateTime_Simple },
    { title: 'Actualizado', dataIndex: 'updated_at', key: 'updated_at', render: formatDateTime },
    {
      title: 'Destacado',
      dataIndex: 'destacado',
      key: 'destacado',
      render: (value) => (value ? <Tag color="gold">Sí</Tag> : 'No'),
    },
  ];

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Cargando...</div>;

  const uniqueOptions = (key) =>
    [...new Set(operaciones.map((op) => op[key] || ''))]
      .filter((val) => val !== 'N/A' && val !== '')
      .map((val) => ({ label: val, value: val }));

  return (
    <div className="page-full" style={{ padding: 24 }}>
      <h1>Buscar Operación</h1>

      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Input
              placeholder="Orden de Compra"
              value={filters.numero_orden_compra}
              onChange={(e) => setFilters((f) => ({ ...f, numero_orden_compra: e.target.value }))}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Carpeta OneDrive"
              value={filters.carpeta_onedrive}
              onChange={(e) => setFilters((f) => ({ ...f, carpeta_onedrive: e.target.value }))}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Factura Proveedor"
              value={filters.numero_factura_proveedor}
              onChange={(e) => setFilters((f) => ({ ...f, numero_factura_proveedor: e.target.value }))}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Incoterm"
              value={filters.incoterm}
              onChange={(e) => setFilters((f) => ({ ...f, incoterm: e.target.value }))}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="N° BL/AWB/CRT"
              value={filters.numero_bl_awb_crt}
              onChange={(e) => setFilters((f) => ({ ...f, numero_bl_awb_crt: e.target.value }))}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Condición Pago Días"
              value={filters.condicion_pago_dias}
              onChange={(e) => setFilters((f) => ({ ...f, condicion_pago_dias: e.target.value }))}
            />
          </Col>

          <Col span={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Cliente"
              value={filters.nombre_cliente || undefined}
              onChange={(value) => setFilters((f) => ({ ...f, nombre_cliente: value }))}
              options={uniqueOptions('nombre_cliente')}
            />
          </Col>
          <Col span={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Proveedor"
              value={filters.nombre_proveedor || undefined}
              onChange={(value) => setFilters((f) => ({ ...f, nombre_proveedor: value }))}
              options={uniqueOptions('nombre_proveedor')}
            />
          </Col>
          <Col span={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Estado"
              value={filters.estado || undefined}
              onChange={(value) => setFilters((f) => ({ ...f, estado: value }))}
              options={uniqueOptions('estado')}
            />
          </Col>
          <Col span={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Tipo Transporte"
              value={filters.tipo_transporte || undefined}
              onChange={(value) => setFilters((f) => ({ ...f, tipo_transporte: value }))}
              options={uniqueOptions('tipo_transporte')}
            />
          </Col>
          <Col span={6}>
            <Select
              allowClear
              style={{ width: '100%' }}
              placeholder="Puerto Destino"
              value={filters.puerto_destino || undefined}
              onChange={(value) => setFilters((f) => ({ ...f, puerto_destino: value }))}
              options={uniqueOptions('puerto_destino')}
            />
          </Col>

          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Desde f_envio_soc', 'Hasta']}
              value={filters.f_envio_soc}
              onChange={(dates) => setFilters((f) => ({ ...f, f_envio_soc: dates }))}
            />
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Desde updated_at', 'Hasta']}
              value={filters.updated_at}
              onChange={(dates) => setFilters((f) => ({ ...f, updated_at: dates }))}
            />
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['Desde ETA', 'Hasta']}
              value={filters.f_eta}
              onChange={(dates) => setFilters((f) => ({ ...f, f_eta: dates }))}
            />
          </Col>
        </Row>
      </Space>

      <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
        Crear operación
      </Button>

      <Modal
        title="Crear nueva operación"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        destroyOnClose
        centered
        width={1000}
      >
        <CrearOperacionModal onFinish={handleCreateOperacion} loading={creating} />
      </Modal>

      <Table
        dataSource={filteredOperaciones}
        columns={columns}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default OperacionesPage;
