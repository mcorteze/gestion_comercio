import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Input, Space, Button, Tooltip, Row, Col, message, Modal } from 'antd';
import { FaTrashAlt } from 'react-icons/fa';
import { RiEdit2Line } from "react-icons/ri";
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
  { title: 'ID', dataIndex: 'id', key: 'id', width: 40, sorter: (a, b) => a.id - b.id },
  { title: 'Nombre', dataIndex: 'nombre', key: 'nombre', width: 120, sorter: (a, b) => (a.nombre || '').localeCompare(b.nombre || '') },
  { title: 'Email', dataIndex: 'email', key: 'email', width: 100, sorter: (a, b) => (a.email || '').localeCompare(b.email || '') },
  { title: 'Teléfono', dataIndex: 'telefono', key: 'telefono', width: 150, sorter: (a, b) => (a.telefono || '').localeCompare(b.telefono || '') },
  { title: 'Dirección', dataIndex: 'direccion', key: 'direccion', width: 200, sorter: (a, b) => (a.direccion || '').localeCompare(b.direccion || '') },
  { title: 'Acciones', key: 'acciones', width: 100, render: (_, record) => (<Space size="small"><Tooltip title="Modificar"><Button icon={<RiEdit2Line />} onClick={() => handleEdit(record.id)} className="action-button edit" /></Tooltip><Tooltip title="Eliminar"><Button icon={<FaTrashAlt />} onClick={() => handleDelete(record.id)} className="action-button danger" /></Tooltip></Space>) },
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

      <Row justify="start" style={{ marginBottom: 20 }}>
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
