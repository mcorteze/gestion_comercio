// src/components/Logistica/LogisticaCampos.js

import React from 'react';
import { Form, Input, DatePicker, Button, Row, Col, Tooltip } from 'antd';

const LogisticaCampos = ({ form, onFinish, renderLabel }) => {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="id" label={renderLabel('ID')} style={{ width: '100px' }}>
        <Input disabled />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="tipo_transporte" label={renderLabel('Tipo Transporte')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="numero_bl_awb_crt" label={renderLabel('Número BL/AWB/CRT')}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="puerto_embarque" label={renderLabel('Puerto Embarque')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="puerto_destino" label={renderLabel('Puerto Destino')}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_etd" label={renderLabel('Fecha ETD')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="f_eta" label={renderLabel('Fecha ETA')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_envio_dctos_intercomex" label={renderLabel('Fecha Envío Dctos Intercomex')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="f_pago_proveedor" label={renderLabel('Fecha Pago Proveedor')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_pago_derechos" label={renderLabel('Fecha Pago Derechos')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="dias_libres" label={renderLabel('Días Libres')}>
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="condicion_pago_dias" label={renderLabel('Condición Pago Días')}>
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

export default LogisticaCampos;
