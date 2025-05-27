import React, { useEffect, useState, useMemo } from 'react';
import { Table, Spin, Button, Space } from 'antd';
import axios from 'axios';
import moment from 'moment';
import * as XLSX from 'xlsx';

const OperacionHistorial = ({ operacionId }) => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aliasMap, setAliasMap] = useState({});
  const [filteredInfo, setFilteredInfo] = useState({}); // Estado filtros columnas

  useEffect(() => {
    if (!operacionId) return;

    const fetchHistorial = async () => {
      setLoading(true);
      try {
        const [historialRes, aliasRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/operacion_historial/${operacionId}`),
          axios.get(`http://localhost:3001/api/alias-campos/tabla/operaciones`),
        ]);

        setHistorial(historialRes.data);

        const aliasObj = {};
        aliasRes.data.forEach(item => {
          aliasObj[item.nombre_campo] = item.alias;
        });
        setAliasMap(aliasObj);
      } catch (error) {
        console.error('Error al obtener historial o alias', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorial();
  }, [operacionId]);

  // Limpia todos los filtros (columnas)
  const clearFilters = () => setFilteredInfo({});

  // Aplica filtro sólo para campo_modificado = 'f_eta' y limpia los demás filtros
  const onlyETA = () => setFilteredInfo({ campo_modificado: ['f_eta'] });

  const downloadExcel = () => {
    let dataToExport = [...historial];

    if (filteredInfo.actividad && filteredInfo.actividad.length > 0) {
      dataToExport = dataToExport.filter(item => filteredInfo.actividad.includes(item.actividad));
    }
    if (filteredInfo.campo_modificado && filteredInfo.campo_modificado.length > 0) {
      dataToExport = dataToExport.filter(item => filteredInfo.campo_modificado.includes(item.campo_modificado));
    }
    if (filteredInfo.valor_anterior && filteredInfo.valor_anterior.length > 0) {
      dataToExport = dataToExport.filter(item => filteredInfo.valor_anterior.includes(item.valor_anterior));
    }
    if (filteredInfo.valor_nuevo && filteredInfo.valor_nuevo.length > 0) {
      dataToExport = dataToExport.filter(item => filteredInfo.valor_nuevo.includes(item.valor_nuevo));
    }

    const data = dataToExport.map(item => ({
      ProveedorNombre: item.proveedor_nombre || '',
      NumeroOrdenCompra: item.numero_orden_compra || '',
      CarpetaOneDrive: item.carpeta_onedrive || '',
      NumeroBL_AWB_CRT: item.numero_bl_awb_crt || '',
      Actividad: item.operacion === 'INSERT' ? 'CREA OPERACIÓN' : item.operacion === 'UPDATE' ? 'MODIFICA' : item.actividad,
      Campo: aliasMap[item.campo_modificado] || item.campo_modificado,
      Antes: item.valor_anterior,
      Después: item.valor_nuevo,
      'Fecha Modificación': moment(item.f_cambio).format('DD/MM/YYYY'),
      
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Historial');
    XLSX.writeFile(wb, 'historial_operacion.xlsx');
  };


  const columns = useMemo(() => [
    {
      title: 'Actividad',
      dataIndex: 'operacion',
      key: 'operacion',
      width: 140,
      filters: [
        { text: 'Crea operación', value: 'INSERT' },
        { text: 'Modifica', value: 'UPDATE' },
      ],
      filteredValue: filteredInfo.actividad || null,
      onFilter: (value, record) => record.actividad === value,
      render: (valor) => {
        if (valor === 'INSERT') return 'Crea operación';
        if (valor === 'UPDATE') return 'Modifica';
        return valor || '-';
      },
      sorter: (a, b) => (a.actividad || '').localeCompare(b.actividad || ''),
    },
    {
      title: 'Campo',
      dataIndex: 'campo_modificado',
      key: 'campo_modificado',
      render: (campo) => aliasMap[campo] || campo,
      filters: Array.from(new Set(historial.map(item => item.campo_modificado).filter(Boolean)))
        .map(val => ({ text: aliasMap[val] || val, value: val })),
      filteredValue: filteredInfo.campo_modificado || null,
      onFilter: (value, record) => record.campo_modificado === value,
      sorter: (a, b) => (a.campo_modificado || '').localeCompare(b.campo_modificado || ''),
    },
    {
      title: 'Antes',
      dataIndex: 'valor_anterior',
      key: 'valor_anterior',
      filters: Array.from(new Set(historial.map(item => item.valor_anterior).filter(Boolean)))
        .map(val => ({ text: val, value: val })),
      filteredValue: filteredInfo.valor_anterior || null,
      onFilter: (value, record) => record.valor_anterior === value,
      sorter: (a, b) => (a.valor_anterior || '').localeCompare(b.valor_anterior || ''),
    },
    {
      title: 'Después',
      dataIndex: 'valor_nuevo',
      key: 'valor_nuevo',
      filters: Array.from(new Set(historial.map(item => item.valor_nuevo).filter(Boolean)))
        .map(val => ({ text: val, value: val })),
      filteredValue: filteredInfo.valor_nuevo || null,
      onFilter: (value, record) => record.valor_nuevo === value,
      sorter: (a, b) => (a.valor_nuevo || '').localeCompare(b.valor_nuevo || ''),
    },
    {
      title: 'Fecha Modificación',
      dataIndex: 'f_cambio',
      key: 'f_cambio',
      render: (f) => moment(f).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.f_cambio) - new Date(b.f_cambio),
    },
  ], [historial, aliasMap, filteredInfo]);

  return loading ? <Spin /> : (
    <div style={{ display: 'flex' }}>
      {/* Columna izquierda: tabla */}
      <div style={{ flex: 1, marginRight: 20 }}>
        <Table
          dataSource={historial}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={false}
          onChange={(pagination, filters, sorter) => setFilteredInfo(filters)}
          // Este filteredValue controla los filtros visuales y activos
          filteredValue={filteredInfo}
        />
      </div>

      {/* Columna derecha: botones */}
      <div style={{ width: 120 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button onClick={clearFilters} type="default" block>
            Quitar Filtros
          </Button>
          <Button onClick={onlyETA} type="default" block>
            Sólo ETA
          </Button>
          <Button onClick={downloadExcel} type="primary" block>
            Descargar
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default OperacionHistorial;
