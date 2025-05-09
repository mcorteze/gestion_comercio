import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProveedoresCrearPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:3001/api/proveedores', values);
      notification.success({ message: 'Proveedor creado correctamente' });
      navigate('/proveedores');
    } catch (err) {
      if (err.response?.status === 409) {
        notification.error({ message: err.response.data.error });
      } else if (err.response?.status === 400) {
        notification.error({ message: 'Todos los campos son obligatorios' });
      } else {
        notification.error({ message: 'Error al crear el proveedor' });
      }
    }
  };

  return (
    <div className="page-full">
      <h1>Crear Proveedor</h1>
      <div className="page-form">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del proveedor' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingrese el email del proveedor' },
              { type: 'email', message: 'El correo electrónico no es válido' },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="País"
            name="pais"
            rules={[{ required: true, message: 'Por favor ingrese el país del proveedor' }]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Condición de Pago (días)"
            name="condicion_pago_dias"
            rules={[{ required: true, message: 'Por favor ingrese los días de la condición de pago' }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              Crear proveedor
            </Button>
            <Button
              danger
              onClick={() => {
                const confirm = window.confirm('¿Está seguro de que desea cancelar? Se perderán los datos ingresados.');
                if (confirm) {
                  navigate('/proveedores');
                }
              }}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ProveedoresCrearPage;
