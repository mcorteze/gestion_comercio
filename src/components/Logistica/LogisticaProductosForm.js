// LogisticaProductosForm.jsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col, message } from 'antd';
import axios from 'axios';

const unidadesDeMedida = ['Unidad', 'Kg', 'Litro', 'Caja', 'Paquete'];

const LogisticaProductosForm = ({ visible, onClose, onSuccess, operacionId, producto }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (producto) {
      form.setFieldsValue({
        ...producto,
        costo_total: producto.precio_unitario * producto.cantidad_facturada || 0,
      });
    } else {
      form.resetFields();
    }
  }, [producto, form]);

  const handleValuesChange = (_, allValues) => {
    const { precio_unitario = 0, cantidad_facturada = 0 } = allValues;
    const costo_total = precio_unitario * cantidad_facturada;
    form.setFieldsValue({ costo_total });
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        operacion_id: operacionId,
        costo_total: values.precio_unitario * values.cantidad_facturada,
      };

      if (producto) {
        await axios.put(`http://localhost:3001/api/productos/${producto.id}`, payload);
        message.success('Producto actualizado');
      } else {
        await axios.post('http://localhost:3001/api/productos', payload);
        message.success('Producto creado');
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      message.error('Error al guardar el producto');
    }
  };

  return (
    <Modal
      title={producto ? 'Editar Producto' : 'Nuevo Producto'}
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Guardar"
      width={1000}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="codigo_sku" label="Código SKU" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="descripcion_producto" label="Descripción" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="categoria_area" label="Categoría/Área" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="tipo_producto" label="Tipo de Producto" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="unidad_medida" label="Unidad de Medida" rules={[{ required: true }]}>
              <Select placeholder="Seleccione una unidad">
                {unidadesDeMedida.map((unidad) => (
                  <Select.Option key={unidad} value={unidad}>
                    {unidad}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="cantidad_solicitada" label="Cantidad Solicitada" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cantidad_facturada" label="Cantidad Facturada" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="precio_unitario" label="Precio Unitario (CLP)" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                step={100}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value) => value.replace(/\$\s?|(,|\.)/g, '')}
              />
            </Form.Item>
            <Form.Item name="costo_total" label="Costo Total (CLP)">
              <InputNumber
                style={{ width: '100%' }}
                disabled
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(value) => value.replace(/\$\s?|(,|\.)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default LogisticaProductosForm;
