import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button, Row, Col, Checkbox } from 'antd';
import axios from 'axios';

const LogisticaPagos = ({ form, onFinish }) => {
  const [aliasMap, setAliasMap] = useState({});

  useEffect(() => {
    axios.get('http://localhost:3001/api/alias-campos/tabla/operaciones')
      .then(res => {
        const aliases = {};
        res.data.forEach(({ nombre_campo, alias }) => {
          aliases[nombre_campo] = alias;
        });
        setAliasMap(aliases);
      })
      .catch(err => console.error('Error cargando alias:', err));
  }, []);

  const getAlias = (campo, fallback) => aliasMap[campo] || fallback;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Pago Proveedor fecha y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="f_pago_proveedor"
            label={getAlias('f_pago_proveedor', 'Fecha Pago Proveedor')}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="pago_proveedor_confirmada"
            valuePropName="checked"
            label={getAlias('pago_proveedor_confirmada', 'Pago Proveedor Confirmada')}
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>

      {/* Envío Dctos Intercomex fecha y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="f_envio_dctos_intercomex"
            label={getAlias('f_envio_dctos_intercomex', 'Fecha Envío Dctos Intercomex')}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="envio_dctos_intercomex_confirmada"
            valuePropName="checked"
            label={getAlias('envio_dctos_intercomex_confirmada', 'Envío Dctos Intercomex Confirmada')}
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>

      {/* Pago Derechos fecha y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="f_pago_derechos"
            label={getAlias('f_pago_derechos', 'Fecha Pago Derechos')}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="pago_derechos_confirmada"
            valuePropName="checked"
            label={getAlias('pago_derechos_confirmada', 'Pago Derechos Confirmada')}
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar Cambios
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LogisticaPagos;
