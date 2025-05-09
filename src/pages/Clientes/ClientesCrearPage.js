import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClientesCrearPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:3001/api/clientes', values);
      notification.success({ message: 'Cliente creado correctamente' });
      navigate('/clientes');
    } catch (err) {
      if (err.response?.status === 409) {
        notification.error({ message: err.response.data.error });
      } else if (err.response?.status === 400) {
        notification.error({ message: 'Todos los campos son obligatorios' });
      } else {
        notification.error({ message: 'Error al crear el cliente' });
      }
    }
  };

  return (
    <div className="page-full">
      <h1>Crear Cliente</h1>
      <div className="page-form">
        <Form form={form} onFinish={onFinish} layout="vertical">
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
              Crear cliente
            </Button>
            <Button
              danger
              onClick={() => {
                const confirm = window.confirm('¿Está seguro de que desea cancelar? Se perderán los datos ingresados.');
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

export default ClientesCrearPage;
