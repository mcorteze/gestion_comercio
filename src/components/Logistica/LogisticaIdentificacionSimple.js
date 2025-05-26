import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Row, Col, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const LogisticaIdentificacionSimple = ({ form, onFinish }) => {
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

  // Función para obtener alias o fallback al texto original
  const getAlias = (campo, fallback) => aliasMap[campo] || fallback;

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="estado" label={getAlias('estado', 'Estado')}>
              <Select placeholder="Seleccione estado">
                <Option value="Esperando confirmación">Esperando confirmación</Option>
                <Option value="En preparación">En preparación</Option>
                <Option value="En tránsito internacional">En tránsito internacional</Option>
                <Option value="Proceso de internación">Proceso de internación</Option>
                <Option value="En tránsito nacional">En tránsito nacional</Option>
                <Option value="Entregado a bodega">Entregado a bodega</Option>
                <Option value="Proceso de costeo">Proceso de costeo</Option>
                <Option value="Completado">Completado</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="numero_bl_awb_crt" label={getAlias('numero_bl_awb_crt', 'Número BL/AWB/CRT')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="transporte" label={getAlias('transporte', 'Transporte')}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="puerto_embarque" label={getAlias('puerto_embarque', 'Puerto Embarque')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="puerto_destino" label={getAlias('puerto_destino', 'Puerto Destino')}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="dias_libres" label={getAlias('dias_libres', 'Días Libres')}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="condicion_pago_dias" label={getAlias('condicion_pago_dias', 'Condición Pago Días')}>
            <Input />
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

export default LogisticaIdentificacionSimple;
