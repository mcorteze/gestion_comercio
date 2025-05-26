import React, { useEffect, useState } from 'react';
import { Modal, Button, Table, Tooltip, Input, Space, Select, DatePicker, Row, Col } from 'antd';
import { IoFlagSharp } from "react-icons/io5";
import { IoSearch } from 'react-icons/io5';
import { RiEdit2Line } from 'react-icons/ri';
import CrearOperacionModal from '../../components/Operaciones/CrearOperacionModal';
import dayjs from 'dayjs';
import axios from 'axios';

const { RangePicker } = DatePicker;

const formatDateTime = (text) => {
  if (!text) return '';
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// Funciones para manejar los clicks
const openModal = (id) => {
  console.log('Abrir modal ver operación:', id);
  // Aquí puedes abrir modal o lo que necesites
};

const openEditModal = (id) => {
  console.log('Abrir modal editar operación:', id);
  // Aquí lógica para editar, por ejemplo abrir otro modal
};

const formatDateTime_Simple = (text) => {
  if (!text) return '';
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};

const OperacionesContent = ({
  modalVisible,
  setModalVisible,
  creating,
  handleCreateOperacion,
  filters,
  setFilters,
  operaciones,
  filteredOperaciones
}) => {
  const [aliasMap, setAliasMap] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/api/alias-campos/tabla/operaciones')
      .then(res => {
        const aliases = {};
        res.data.forEach(({ nombre_campo, alias }) => {
          aliases[nombre_campo] = alias;
        });
        setAliasMap(aliases);
      })
      .catch(err => {
        console.error('Error al cargar alias:', err);
      });
  }, []);

  const getAlias = (campo) => aliasMap[campo] || campo;

  const columns = [
    {
      title: getAlias(''),
      dataIndex: 'destacado',
      key: 'destacado',
      width: 20,
      render: (value) => (
        value ? <IoFlagSharp color="crimson" size={12} /> : ''
      ),
      sorter: (a, b) => (a.destacado === b.destacado ? 0 : a.destacado ? -1 : 1),
    },
    { title: getAlias('estado'), dataIndex: 'estado', key: 'estado', width: 100, sorter: (a, b) => (a.estado || '').localeCompare(b.estado || '') },
    { title: getAlias('numero_orden_compra'), dataIndex: 'numero_orden_compra', width: 80, key: 'numero_orden_compra', sorter: (a, b) => (a.numero_orden_compra || '').localeCompare(b.numero_orden_compra || '') },
    { title: getAlias('carpeta_onedrive'), dataIndex: 'carpeta_onedrive', key: 'carpeta_onedrive', width: 60, sorter: (a, b) => (a.carpeta_onedrive || '').localeCompare(b.carpeta_onedrive || '') },
    { title: getAlias('nombre_cliente'), dataIndex: 'nombre_cliente', key: 'nombre_cliente', width: 120, sorter: (a, b) => (a.nombre_cliente || '').localeCompare(b.nombre_cliente || '') },
    { title: getAlias('nombre_proveedor'), dataIndex: 'nombre_proveedor', key: 'nombre_proveedor', width: 120, sorter: (a, b) => (a.nombre_proveedor || '').localeCompare(b.nombre_proveedor || '') },
    { title: getAlias('f_envio_soc'), dataIndex: 'f_envio_soc', key: 'f_envio_soc', width: 80, render: formatDateTime_Simple, sorter: (a, b) => new Date(a.f_envio_soc) - new Date(b.f_envio_soc) },
    { title: getAlias('numero_doc_solicitud'), dataIndex: 'numero_doc_solicitud', key: 'numero_doc_solicitud', width: 80, sorter: (a, b) => (a.numero_doc_solicitud || '').localeCompare(b.numero_doc_solicitud || '') },
    { title: getAlias('numero_confirmacion_orden'), dataIndex: 'numero_confirmacion_orden', key: 'numero_confirmacion_orden', width: 100, sorter: (a, b) => (a.numero_confirmacion_orden || '').localeCompare(b.numero_confirmacion_orden || '') },
    { title: getAlias('numero_factura_proveedor'), dataIndex: 'numero_factura_proveedor', key: 'numero_factura_proveedor', width: 80, sorter: (a, b) => (a.numero_factura_proveedor || '').localeCompare(b.numero_factura_proveedor || '') },
    { title: getAlias('incoterm'), dataIndex: 'incoterm', key: 'incoterm', width: 60, sorter: (a, b) => (a.incoterm || '').localeCompare(b.incoterm || '') },
    { title: getAlias('transporte'), dataIndex: 'transporte', key: 'transporte', width: 80, sorter: (a, b) => (a.transporte || '').localeCompare(b.transporte || '') },
    { title: getAlias('puerto_destino'), dataIndex: 'puerto_destino', key: 'puerto_destino', width: 80, sorter: (a, b) => (a.puerto_destino || '').localeCompare(b.puerto_destino || '') },
    { title: getAlias('numero_bl_awb_crt'), dataIndex: 'numero_bl_awb_crt', key: 'numero_bl_awb_crt', width: 80, sorter: (a, b) => (a.numero_bl_awb_crt || '').localeCompare(b.numero_bl_awb_crt || '') },
    { title: getAlias('condicion_pago_dias'), dataIndex: 'condicion_pago_dias', key: 'condicion_pago_dias', width: 40, sorter: (a, b) => a.condicion_pago_dias - b.condicion_pago_dias },
    { title: getAlias('f_etd'), dataIndex: 'f_etd', key: 'f_etd', width: 80, render: formatDateTime_Simple, sorter: (a, b) => new Date(a.f_etd) - new Date(b.f_etd) },
    { title: getAlias('etd_confirmada'), dataIndex: 'etd_confirmada', key: 'etd_confirmada', width: 80, render: formatDateTime_Simple, sorter: (a, b) => new Date(a.etd_confirmada) - new Date(b.etd_confirmada) },
    { title: getAlias('f_eta'), dataIndex: 'f_eta', key: 'f_eta', width: 80, render: formatDateTime_Simple, sorter: (a, b) => new Date(a.f_eta) - new Date(b.f_eta) },
    { title: getAlias('eta_confirmada'), dataIndex: 'eta_confirmada', key: 'eta_confirmada', width: 80, render: formatDateTime_Simple, sorter: (a, b) => new Date(a.eta_confirmada) - new Date(b.eta_confirmada) },
    { title: getAlias('f_etb'), dataIndex: 'f_etb', key: 'f_etb', width: 80, render: formatDateTime_Simple, sorter: (a, b) => new Date(a.f_etb) - new Date(b.f_etb) },
    { title: getAlias('etb_confirmada'), dataIndex: 'etb_confirmada', key: 'etb_confirmada', width: 80, render: formatDateTime_Simple, sorter: (a, b) => new Date(a.etb_confirmada) - new Date(b.etb_confirmada) },
    {
    title: getAlias('acciones') || 'Acciones',
    key: 'acciones',
    width: 100,
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        <Tooltip title="Ver">
          <Button
            icon={<IoSearch />}
            className="action-button search"
            onClick={() => openModal(record.id)}
            size="small"
          />
        </Tooltip>
        <Tooltip title="Modificar">
          <Button
            icon={<RiEdit2Line />}
            className="action-button edit"
            onClick={() => openEditModal(record.id)}
            size="small"
          />
        </Tooltip>
      </Space>
    ),
  },
  ];


  const uniqueOptions = (key) =>
    [...new Set(operaciones.map((op) => op[key] || ''))]
      .filter((val) => val !== 'N/A' && val !== '')
      .map((val) => ({ label: val, value: val }));

  return (
    <div className="page-full" style={{ padding: 24 }}>
      <h1>Buscar Operación</h1>

      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          {[
            'numero_orden_compra',
            'carpeta_onedrive',
            'numero_factura_proveedor',
            'incoterm',
            'numero_bl_awb_crt',
            'condicion_pago_dias',
          ].map((key) => (
            <Col span={6} key={key}>
              <Input
                placeholder={getAlias(key)}
                value={filters[key]}
                onChange={(e) => setFilters(f => ({ ...f, [key]: e.target.value }))}
              />
            </Col>
          ))}

          {[
            'nombre_cliente',
            'nombre_proveedor',
            'estado',
            'tipo_transporte',
            'puerto_destino',
          ].map((key) => (
            <Col span={6} key={key}>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder={getAlias(key)}
                value={filters[key] || undefined}
                onChange={(value) => setFilters(f => ({ ...f, [key]: value }))}
                options={uniqueOptions(key)}
              />
            </Col>
          ))}

          {[
            ['Desde', 'Hasta', 'f_envio_soc'],
            ['Desde', 'Hasta', 'updated_at'],
            ['Desde', 'Hasta', 'f_eta'],
          ].map(([start, end, key]) => (
            <Col span={6} key={key}>
              <RangePicker
                style={{ width: '100%' }}
                placeholder={[`${start} ${getAlias(key)}`, `${end} ${getAlias(key)}`]}
                value={filters[key]}
                onChange={(dates) => setFilters((f) => ({ ...f, [key]: dates }))}
              />
            </Col>
          ))}
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

export default OperacionesContent;
