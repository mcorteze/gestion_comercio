import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Space, Button, Tooltip, Row, Col, message, Modal } from 'antd';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './ProveedoresPage.css';

const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/proveedores');
        setProveedores(response.data);
        setFilteredProveedores(response.data);
      } catch (err) {
        setError('Error al obtener los proveedores');
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  const handleSearch = (value) => {
    const query = normalizeText(value);

    const filtered = proveedores.filter((prov) => {
      const nombre = normalizeText(prov.nombre);
      const email = normalizeText(prov.email);
      return nombre.includes(query) || email.includes(query);
    });

    setFilteredProveedores(filtered);
    setSearchText(value.trim());
  };

  const handleEdit = (id) => {
    navigate(`/proveedores/${id}`);
  };

  const handleAddProveedor = () => {
    navigate('/crear_proveedor');
  };

  const handleDelete = (id) => {
    const proveedor = proveedores.find((p) => p.id === id);
    Modal.confirm({
      title: `¿Estás seguro de eliminar a ${proveedor?.nombre}?`,
      content: 'Esta acción eliminará todos los registros relacionados a este proveedor.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3001/api/proveedores/${id}`);
          message.success('Proveedor eliminado correctamente');
          // Recargar proveedores
          const response = await axios.get('http://localhost:3001/api/proveedores');
          setProveedores(response.data);
          setFilteredProveedores(response.data);
        } catch (error) {
          console.error('Error al eliminar proveedor', error);
          message.error('Error al eliminar el proveedor');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'País', dataIndex: 'pais', key: 'pais' },
    { title: 'Cond. Pago (días)', dataIndex: 'condicion_pago_dias', key: 'condicion_pago_dias' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Modificar">
            <Button
              icon={<FaEdit />}
              onClick={() => handleEdit(record.id)}
              className="action-button edit"
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              icon={<FaTrashAlt />}
              onClick={() => handleDelete(record.id)}
              className="action-button danger"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Cargando...</div>;

  return (
    <div className="page-full">
      <h1>Buscar Proveedor</h1>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por nombre o email"
          enterButton="Buscar"
          onSearch={handleSearch}
          allowClear
        />
      </Space>

      <Row justify="end" style={{ marginBottom: 8 }}>
        <Col>
          <Button type="primary" onClick={handleAddProveedor}>
            Agregar proveedor
          </Button>
        </Col>
      </Row>

      <Table dataSource={filteredProveedores} columns={columns} rowKey="id" />
    </div>
  );
};

export default ProveedoresPage;
