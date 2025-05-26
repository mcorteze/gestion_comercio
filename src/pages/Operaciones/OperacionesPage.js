import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OperacionesContent from '../../components/Operaciones/OperacionesContent'; // hijo

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
    setTimeout(() => {
      setCreating(false);
      setModalVisible(false);
    }, 1000);
  };

  const normalizeText = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

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
    const dayjs = require('dayjs');
    const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
    const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
    dayjs.extend(isSameOrBefore);
    dayjs.extend(isSameOrAfter);

    const applyFilters = () => {
      let filtered = [...operaciones];

      Object.entries(filters).forEach(([key, value]) => {
        if (!value || value === '') return;

        // Si es un rango de fechas (usado en RangePicker)
        if (Array.isArray(value) && value[0] && value[1]) {
          filtered = filtered.filter((op) => {
            const date = dayjs(op[key]);
            return date.isValid() &&
              dayjs(value[0]).isSameOrBefore(date, 'day') &&
              dayjs(value[1]).isSameOrAfter(date, 'day');
          });
        } else {
          // Para filtros de texto o select
          filtered = filtered.filter((op) =>
            normalizeText(op[key] || '').includes(normalizeText(value))
          );
        }
      });

      setFilteredOperaciones(filtered);
    };

    applyFilters();
  }, [filters, operaciones]);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    <OperacionesContent
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      creating={creating}
      handleCreateOperacion={handleCreateOperacion}
      filters={filters}
      setFilters={setFilters}
      operaciones={operaciones}
      filteredOperaciones={filteredOperaciones}
    />
  );
};

export default OperacionesPage;
