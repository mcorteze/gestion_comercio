import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Button, Row, Col, Checkbox } from 'antd';
import axios from 'axios';

const LogisticaEt = ({ form, onFinish }) => {
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
      {/* ETD fecha y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_etd" label={getAlias('f_etd', 'Fecha ETD')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="etd_confirmada"
            valuePropName="checked"
            label={getAlias('etd_confirmada', 'ETD Confirmada')}
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>

      {/* ETA fecha y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_eta" label={getAlias('f_eta', 'Fecha ETA')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="eta_confirmada"
            valuePropName="checked"
            label={getAlias('eta_confirmada', 'ETA Confirmada')}
          >
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>

      {/* ETB fecha y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_etb" label={getAlias('f_etb', 'Fecha ETB')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="etb_confirmada"
            valuePropName="checked"
            label={getAlias('etb_confirmada', 'ETB Confirmada')}
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

export default LogisticaEt;
