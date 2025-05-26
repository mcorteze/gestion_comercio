import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';

const { Option } = Select;

const CamposLogistica = ({ clientes, proveedores }) => {
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
      .catch(err => {
        console.error('Error al cargar alias:', err);
      });
  }, []);

  const getAlias = (campo) => aliasMap[campo] || campo;

  return (
    <>
      <Form.Item
        label={getAlias("tipo_transporte")}
        name="tipo_transporte"
        rules={[{ required: true, message: 'Ingrese el tipo de transporte' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={getAlias("numero_bl_awb_crt")}
        name="numero_bl_awb_crt"
        rules={[{ required: true, message: 'Ingrese el número de transporte' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={getAlias("puerto_embarque")}
        name="puerto_embarque"
        rules={[{ required: true, message: 'Ingrese el puerto de embarque' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={getAlias("puerto_destino")}
        name="puerto_destino"
        rules={[{ required: true, message: 'Ingrese el puerto de destino' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={getAlias("f_etd")}
        name="f_etd"
        rules={[{ required: true, message: 'Seleccione la fecha ETD' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item
        label={getAlias("f_eta")}
        name="f_eta"
        rules={[{ required: true, message: 'Seleccione la fecha ETA' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item
        label={getAlias("f_envio_dctos_intercomex")}
        name="f_envio_dctos_intercomex"
        rules={[{ required: true, message: 'Seleccione la fecha de envío' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item
        label={getAlias("f_pago_proveedor")}
        name="f_pago_proveedor"
        rules={[{ required: true, message: 'Seleccione la fecha de pago al proveedor' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item
        label={getAlias("f_pago_derechos")}
        name="f_pago_derechos"
        rules={[{ required: true, message: 'Seleccione la fecha de pago de derechos' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item
        label={getAlias("dias_libres")}
        name="dias_libres"
        rules={[{ required: true, message: 'Ingrese los días libres' }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label={getAlias("condicion_pago_dias")}
        name="condicion_pago_dias"
        rules={[{ required: true, message: 'Ingrese la condición de pago' }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label={getAlias("estado")}
        name="estado"
        rules={[{ required: true, message: 'Seleccione el estado' }]}
      >
        <Select placeholder="Seleccionar estado">
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
    </>
  );
};

export default CamposLogistica;
