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
    title: 'N°BL/AWB/CRT',
    dataIndex: 'numero_bl_awb_crt',
    key: 'numero_bl_awb_crt',
    width: 120,
    className: 'campo-filtrable',
    ...getColumnFilterProps('numero_bl_awb_crt'),
    sorter: (a, b) => (a.numero_bl_awb_crt || '').localeCompare(b.numero_bl_awb_crt || ''),
    onHeaderCell: () => ({ className: 'campo-filtrable' }),
  },
  {
    title: 'Puerto Embarque',
    dataIndex: 'puerto_embarque',
    key: 'puerto_embarque',
    width: 140,
    className: 'campo-filtrable',
    ...getColumnFilterProps('puerto_embarque'),
    sorter: (a, b) => (a.puerto_embarque || '').localeCompare(b.puerto_embarque || ''),
    onHeaderCell: () => ({ className: 'campo-filtrable' }),
  },
  {
    title: 'Puerto Destino',
    dataIndex: 'puerto_destino',
    key: 'puerto_destino',
    width: 140,
    className: 'campo-filtrable',
    ...getColumnFilterProps('puerto_destino'),
    sorter: (a, b) => (a.puerto_destino || '').localeCompare(b.puerto_destino || ''),
    onHeaderCell: () => ({ className: 'campo-filtrable' }),
  },
  {
    title: 'Transporte',
    dataIndex: 'transporte',
    key: 'transporte',
    width: 120,
    className: 'campo-filtrable',
    ...getColumnFilterProps('transporte'),
    sorter: (a, b) => (a.transporte || '').localeCompare(b.transporte || ''),
    onHeaderCell: () => ({ className: 'campo-filtrable' }),
  },
  {
    title: 'Fecha Dctos enviados Intercomex',
    dataIndex: 'f_envio_dctos_intercomex',
    key: 'f_envio_dctos_intercomex',
    width: 140,
    render: formatDateTime_Simple,
    sorter: (a, b) => new Date(a.f_envio_dctos_intercomex) - new Date(b.f_envio_dctos_intercomex),
  },
  {
    title: 'Fecha Pago Proveedor',
    dataIndex: 'f_pago_proveedor',
    key: 'f_pago_proveedor',
    width: 140,
    render: formatDateTime_Simple,
    sorter: (a, b) => new Date(a.f_pago_proveedor) - new Date(b.f_pago_proveedor),
  },
  {
    title: 'Fecha Pago Derechos',
    dataIndex: 'f_pago_derechos',
    key: 'f_pago_derechos',
    width: 140,
    render: formatDateTime_Simple,
    sorter: (a, b) => new Date(a.f_pago_derechos) - new Date(b.f_pago_derechos),
  },
  {
    title: 'Días Libres',
    dataIndex: 'dias_libres',
    key: 'dias_libres',
    width: 100,
    className: 'campo-filtrable',
    ...getColumnFilterProps('dias_libres'),
    sorter: (a, b) => a.dias_libres - b.dias_libres,
    onHeaderCell: () => ({ className: 'campo-filtrable' }),
  },
  {
    title: 'Condición de Pago (días)',
    dataIndex: 'condicion_pago_dias',
    key: 'condicion_pago_dias',
    width: 140,
    className: 'campo-filtrable',
    ...getColumnFilterProps('condicion_pago_dias'),
    sorter: (a, b) => a.condicion_pago_dias - b.condicion_pago_dias,
    onHeaderCell: () => ({ className: 'campo-filtrable' }),
  },
  {
    title: 'Transit Time International',
    key: 'transit_time_international',
    width: 160,
    render: (_, record) => {
      const { f_etd, f_eta } = record;
      if (f_etd && f_eta) {
        const etd = new Date(f_etd);
        const eta = new Date(f_eta);
        const diff = (eta - etd) / (1000 * 60 * 60 * 24); // diferencia en días
        return diff > 0 ? Math.round(diff) : '-';
      }
      return '-';
    },
    sorter: (a, b) => {
      const aDiff = a.f_etd && a.f_eta ? new Date(a.f_eta) - new Date(a.f_etd) : 0;
      const bDiff = b.f_etd && b.f_eta ? new Date(b.f_eta) - new Date(b.f_etd) : 0;
      return aDiff - bDiff;
    },
  },
  {
    title: 'Transit Time National',
    key: 'transit_time_national',
    width: 160,
    render: (_, record) => {
      const { f_eta, f_etb } = record;
      if (f_eta && f_etb) {
        const eta = new Date(f_eta);
        const etb = new Date(f_etb);
        const diff = (etb - eta) / (1000 * 60 * 60 * 24); // diferencia en días
        return diff > 0 ? Math.round(diff) : '-';
      }
      return '-';
    },
    sorter: (a, b) => {
      const aDiff = a.f_eta && a.f_etb ? new Date(a.f_etb) - new Date(a.f_eta) : 0;
      const bDiff = b.f_eta && b.f_etb ? new Date(b.f_etb) - new Date(b.f_eta) : 0;
      return aDiff - bDiff;
    },
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
