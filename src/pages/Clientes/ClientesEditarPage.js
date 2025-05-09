import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ClientesEditarPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del cliente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/clientes/${id}`);
        form.setFieldsValue(response.data);
      } catch (err) {
        setError('Error al obtener el cliente');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      await axios.put(`http://localhost:3001/api/clientes/${id}`, values);
      notification.success({ message: 'Cliente actualizado correctamente' });
      navigate('/clientes');
    } catch (err) {
      if (err.response?.status === 409) {
        notification.error({ message: err.response.data.error });
      } else {
        notification.error({ message: 'Error al actualizar el cliente' });
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-full">
      <h1>Editar Cliente</h1>
      <div className="page-form">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingrese el email' },
              { type: 'email', message: 'El correo electrónico no es válido' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true, message: 'Por favor ingrese el teléfono' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Dirección"
            name="direccion"
            rules={[{ required: true, message: 'Por favor ingrese la dirección' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              Guardar cambios
            </Button>
            <Button
              danger
              onClick={() => {
                const confirm = window.confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.');
                if (confirm) {
                  navigate('/clientes');
                }
              }}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ClientesEditarPage;
