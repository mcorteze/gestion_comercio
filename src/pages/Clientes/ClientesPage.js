import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Space, Button, Tooltip, Row, Col, message, Modal } from 'antd';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import './ClientesPage.css';

const normalizeText = (text) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/clientes');
      setClientes(response.data);
      setFilteredClientes(response.data);
    } catch (err) {
      setError('Error al obtener los clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const query = normalizeText(value);
    const filtered = clientes.filter((cliente) => {
      const nombre = normalizeText(cliente.nombre);
      const email = normalizeText(cliente.email);
      return nombre.includes(query) || email.includes(query);
    });
    setFilteredClientes(filtered);
    setSearchText(value.trim());
  };

  const handleEdit = (id) => {
    navigate(`/clientes/${id}`);
  };

  const handleAddClient = () => {
    navigate('/crear_cliente');
  };

  const handleDelete = (id) => {
    const cliente = clientes.find((c) => c.id === id);
    Modal.confirm({
      title: `¿Estás seguro de eliminar a ${cliente?.nombre}?`,
      content: 'Esta acción eliminará todos los registros relacionados a este cliente.',
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3001/api/clientes/${id}`);
          message.success('Cliente eliminado correctamente');
          fetchClientes();
        } catch (error) {
          console.error('Error al eliminar cliente', error);
          message.error('Error al eliminar el cliente');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono' },
    { title: 'Dirección', dataIndex: 'direccion', key: 'direccion' },
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
      <h1>Buscar Cliente</h1>
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
          <Button type="primary" onClick={handleAddClient}>
            Agregar cliente
          </Button>
        </Col>
      </Row>

      <Table dataSource={filteredClientes} columns={columns} rowKey="id" />
    </div>
  );
};

export default ClientesPage;
