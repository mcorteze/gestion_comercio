import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Input, Space, Button } from 'antd';
import OperacionesTable from '../../components/Logistica/OperacionesTable';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

const formatDateTime_Simple = (text) => {
  const date = new Date(text);
  const pad = (n) => n.toString().padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};

const LogisticaPage = () => {
  const [operaciones, setOperaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operacionesRes, clientesRes, proveedoresRes] = await Promise.all([
          axios.get('http://localhost:3001/api/operaciones'),
          axios.get('http://localhost:3001/api/clientes'),
          axios.get('http://localhost:3001/api/proveedores'),
        ]);
        setOperaciones(operacionesRes.data);
        setClientes(clientesRes.data);
        setProveedores(proveedoresRes.data);
      } catch (err) {
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProveedorNombre = (id) => {
    const proveedor = proveedores.find((p) => p.id === id);
    return proveedor ? proveedor.nombre : '—';
  };

  const handleSearch = (value) => {
    setSearchText(value.trim());
  };

  const handleColumnFilterChange = (columnKey, selectedValues) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnKey]: selectedValues,
    }));
  };

  const clearAllFilters = () => {
    setColumnFilters({});
  };

  const filteredData = operaciones.filter((op) => {
    const query = normalizeText(searchText);
    const numeroOrden = normalizeText(op.numero_orden_compra || '');
    const numeroBL = normalizeText(op.numero_bl_awb_crt || '');

    const matchesSearch = numeroOrden.includes(query) || numeroBL.includes(query);
    const matchesFilters = Object.entries(columnFilters).every(([key, selected]) => {
      if (!selected || selected.length === 0) return true;
      const value = key === 'proveedor_id' ? getProveedorNombre(op[key]) : op[key];
      return selected.includes(value);
    });

    return matchesSearch && matchesFilters;
  });

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="page-full">
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por orden de compra o número BL AWB CRT"
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button onClick={clearAllFilters}>Limpiar todos los filtros</Button>
      </Space>
      <OperacionesTable
        operaciones={operaciones}
        columnFilters={columnFilters}
        handleColumnFilterChange={handleColumnFilterChange}
        getProveedorNombre={getProveedorNombre}
        formatDateTime_Simple={formatDateTime_Simple}
        filteredData={filteredData}
      />
    </div>
  );
};

export default LogisticaPage;
