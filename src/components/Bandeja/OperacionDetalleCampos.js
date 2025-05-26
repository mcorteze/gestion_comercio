import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Row, Col, Select, Tooltip, Checkbox } from 'antd';
import axios from 'axios';

const OperacionDetalleCampos = ({ form, onFinish }) => {
  const [aliasMap, setAliasMap] = useState({});

  const ESTADOS_LOGISTICA = [
    "Esperando confirmación",
    "En preparación",
    "En tránsito internacional",
    "Proceso de internación",
    "En tránsito nacional",
    "Entregado a bodega",
    "Proceso de costeo",
    "Completado",
  ];

  useEffect(() => {
    axios.get('http://localhost:3001/api/alias-campos/tabla/operaciones')
      .then((res) => {
        const map = {};
        res.data.forEach(({ nombre_campo, alias }) => {
          map[nombre_campo] = alias;
        });
        setAliasMap(map);
      })
      .catch((err) => {
        console.error('Error cargando alias:', err);
      });
  }, []);

  const getAlias = (campo, fallback) => {
    const alias = aliasMap[campo] || fallback || campo;
    return (
      <Tooltip title={alias}>
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 180,
          }}
        >
          {alias}
        </div>
      </Tooltip>
    );
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="estado" label={getAlias('estado', 'Estado')}>
            <Select placeholder="Seleccionar estado">
              {ESTADOS_LOGISTICA.map((estado) => (
                <Select.Option key={estado} value={estado}>
                  {estado}
                </Select.Option>
              ))}
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

      {/* Fecha ETD y confirmación */}
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

      {/* Fecha ETA y confirmación */}
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

      {/* Fecha ETB y confirmación */}
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

      {/* Fecha Envío Dctos Intercomex y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_envio_dctos_intercomex" label={getAlias('f_envio_dctos_intercomex', 'Fecha Envío Dctos Intercomex')}>
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

      {/* Fecha Pago Proveedor y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_pago_proveedor" label={getAlias('f_pago_proveedor', 'Fecha Pago Proveedor')}>
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

      {/* Fecha Pago Derechos y confirmación */}
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="f_pago_derechos" label={getAlias('f_pago_derechos', 'Fecha Pago Derechos')}>
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

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="dias_libres" label={getAlias('dias_libres', 'Días Libres')}>
            <Input />
          </Form.Item>
        </Col>
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

export default OperacionDetalleCampos;
