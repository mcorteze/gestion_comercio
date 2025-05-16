import React from 'react';
import { Table, Space, Button, Tooltip } from 'antd';
import { FaTrashAlt } from 'react-icons/fa';
import { RiEdit2Line } from "react-icons/ri";
import ColumnFilter from './ColumnFilter';

const OperacionesTable = ({
  operaciones,
  columnFilters,
  handleColumnFilterChange,
  getProveedorNombre,
  formatDateTime_Simple,
  filteredData
}) => {

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
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      ...getColumnFilterProps('estado'),
      onHeaderCell: () => ({
        className: 'campo-filtrable',
      }),
    },
    {
      title: 'Número Orden Compra',
      dataIndex: 'numero_orden_compra',
      className: 'campo-filtrable',
      key: 'numero_orden_compra',
      ...getColumnFilterProps('numero_orden_compra'),
    },
    {
      title: 'Número BL/AWB/CRT',
      dataIndex: 'numero_bl_awb_crt',
      className: 'campo-filtrable',
      key: 'numero_bl_awb_crt',
      ...getColumnFilterProps('numero_bl_awb_crt'),
    },
    {
      title: 'Proveedor',
      dataIndex: 'proveedor_id',
      className: 'campo-filtrable',
      key: 'proveedor_id',
      render: (id) => getProveedorNombre(id),
      ...getColumnFilterProps('proveedor_id', getProveedorNombre),
    },
    {
      title: 'Fecha ETA',
      dataIndex: 'f_eta',
      key: 'f_eta',
      render: formatDateTime_Simple,
    },
    {
      title: 'Fecha Pago Proveedor',
      dataIndex: 'f_pago_proveedor',
      key: 'f_pago_proveedor',
      render: formatDateTime_Simple,
    },
    {
      title: 'Fecha Pago Derechos',
      dataIndex: 'f_pago_derechos',
      key: 'f_pago_derechos',
      render: formatDateTime_Simple,
    },
    {
      title: 'Condición Pago Días',
      dataIndex: 'condicion_pago_dias',
      className: 'campo-filtrable',
      key: 'condicion_pago_dias',
      ...getColumnFilterProps('condicion_pago_dias'),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 80,
      render: () => (
        <Space size="small">
          <Tooltip title="Modificar">
            <Button
              icon={<RiEdit2Line />}
              // No action por ahora
              className="action-button edit"
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<FaTrashAlt />}
              // No action por ahora
              className="action-button danger"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      dataSource={filteredData}
      columns={columns}
      rowKey="id"
      scroll={{ x: 'max-content' }}
    />
  );
};

export default OperacionesTable;
