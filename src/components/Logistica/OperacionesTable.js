import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Tooltip, Modal } from 'antd';
import { FaTrashAlt } from 'react-icons/fa';
import { RiEdit2Line } from "react-icons/ri";
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import ColumnFilter from './ColumnFilter';
import OperacionStepsDetalle from '../Bandeja/OperacionStepsDetalle';
import LogisticaEditarPage from '../../pages/Logistica/LogisticaEditarPage';

const OperacionesTable = ({
  operaciones,
  columnFilters,
  handleColumnFilterChange,
  getProveedorNombre,
  formatDateTime_Simple,
  filteredData
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState(null);
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
      .catch(err => console.error('Error cargando alias:', err));
  }, []);

  const getAlias = (campo) => aliasMap[campo] || campo;

  const openModal = (id) => {
    setSelectedOperacionId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOperacionId(null);
  };

  const openEditModal = (id) => {
    setSelectedOperacionId(id);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setSelectedOperacionId(null);
  };

  const getColumnFilterProps = (dataIndex, getDisplayValue) =>
    ColumnFilter({
      dataIndex,
      operaciones,
      columnFilters,
      handleColumnFilterChange,
      getDisplayValue,
    });

const columns = [
  {
    title: getAlias('estado'),
    dataIndex: 'estado',
    key: 'estado',
    width: 120,
    ...getColumnFilterProps('estado'),
    onHeaderCell: () => ({ className: 'campo-filtrable' }),
    sorter: (a, b) => (a.estado || '').localeCompare(b.estado || ''),
  },
  {
    title: getAlias('numero_orden_compra'),
    dataIndex: 'numero_orden_compra',
    key: 'numero_orden_compra',
    width: 80,
    className: 'campo-filtrable',
    ...getColumnFilterProps('numero_orden_compra'),
    sorter: (a, b) => (a.numero_orden_compra || '').localeCompare(b.numero_orden_compra || ''),
  },
  {
    title: getAlias('numero_bl_awb_crt'),
    dataIndex: 'numero_bl_awb_crt',
    key: 'numero_bl_awb_crt',
    width: 80,
    className: 'campo-filtrable',
    ...getColumnFilterProps('numero_bl_awb_crt'),
    sorter: (a, b) => (a.numero_bl_awb_crt || '').localeCompare(b.numero_bl_awb_crt || ''),
  },
  {
    title: getAlias('proveedor_id'),
    dataIndex: 'proveedor_id',
    key: 'proveedor_id',
    width: 120,
    className: 'campo-filtrable',
    render: (id) => getProveedorNombre(id),
    ...getColumnFilterProps('proveedor_id', getProveedorNombre),
    sorter: (a, b) => getProveedorNombre(a.proveedor_id).localeCompare(getProveedorNombre(b.proveedor_id)),
  },
  {
    title: getAlias('f_eta'),
    dataIndex: 'f_eta',
    key: 'f_eta',
    width: 80,
    render: formatDateTime_Simple,
    sorter: (a, b) => new Date(a.f_eta) - new Date(b.f_eta),
  },
  {
    title: getAlias('f_pago_proveedor'),
    dataIndex: 'f_pago_proveedor',
    key: 'f_pago_proveedor',
    width: 80,
    render: formatDateTime_Simple,
    sorter: (a, b) => new Date(a.f_pago_proveedor) - new Date(b.f_pago_proveedor),
  },
  {
    title: getAlias('f_pago_derechos'),
    dataIndex: 'f_pago_derechos',
    key: 'f_pago_derechos',
    width: 80,
    render: formatDateTime_Simple,
    sorter: (a, b) => new Date(a.f_pago_derechos) - new Date(b.f_pago_derechos),
  },
  {
    title: getAlias('condicion_pago_dias'),
    dataIndex: 'condicion_pago_dias',
    key: 'condicion_pago_dias',
    width: 80,
    className: 'campo-filtrable',
    ...getColumnFilterProps('condicion_pago_dias'),
    sorter: (a, b) => a.condicion_pago_dias - b.condicion_pago_dias,
  },
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
          />
        </Tooltip>
        <Tooltip title="Modificar">
          <Button
            icon={<RiEdit2Line />}
            className="action-button edit"
            onClick={() => openEditModal(record.id)}
          />
        </Tooltip>
        <Tooltip title="Eliminar">
          <Button icon={<FaTrashAlt />} className="action-button danger" />
        </Tooltip>
      </Space>
    ),
  },
];



  return (
    <>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="id"
        scroll={{ x: 'max-content' }}
      />

      {/* Modal VER detalle */}
      <Modal
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={1000}
      >
        {selectedOperacionId && (
          <OperacionStepsDetalle operacionId={selectedOperacionId} />
        )}
      </Modal>

      {/* Modal MODIFICAR */}
      <Modal
        open={editModalVisible}
        onCancel={closeEditModal}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
      >
        {selectedOperacionId && (
          <LogisticaEditarPage id={selectedOperacionId} />
        )}
      </Modal>
    </>
  );
};

export default OperacionesTable;
