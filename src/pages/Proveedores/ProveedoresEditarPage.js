import React, { useState, useEffect } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProveedoresEditarPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del proveedor
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/proveedores/${id}`);
        form.setFieldsValue(response.data);
      } catch (err) {
        setError('Error al obtener el proveedor');
      } finally {
        setLoading(false);
      }
    };

    fetchProveedor();
  }, [id, form]);

  const onFinish = async (values) => {
    try {
      await axios.put(`http://localhost:3001/api/proveedores/${id}`, values);
      notification.success({ message: 'Proveedor actualizado correctamente' });
      navigate('/proveedores');
    } catch (err) {
      if (err.response?.status === 409) {
        notification.error({ message: err.response.data.error });
      } else {
        notification.error({ message: 'Error al actualizar el proveedor' });
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-full">
      <h1>Editar Proveedor</h1>
      <div className="page-form">
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>

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
              Guardar cambios
            </Button>
            <Button
              danger
              onClick={() => {
                const confirm = window.confirm('¿Está seguro de que desea cancelar? Se perderán los cambios no guardados.');
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

export default ProveedoresEditarPage;
