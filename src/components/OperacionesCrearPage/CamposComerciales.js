import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import axios from 'axios';

const { Option } = Select;

const CamposComerciales = ({ clientes, proveedores }) => {
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
        label={getAlias("cliente_id")}
        name="cliente_id"
        rules={[{ required: true, message: 'Seleccione un cliente' }]}
      >
        <Select placeholder="Seleccionar cliente">
          {clientes.map((c) => (
            <Option key={c.id} value={c.id}>
              {c.nombre}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={getAlias("proveedor_id")}
        name="proveedor_id"
        rules={[{ required: true, message: 'Seleccione un proveedor' }]}
      >
        <Select placeholder="Seleccionar proveedor">
          {proveedores.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.nombre}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={getAlias("f_envio_soc")}
        name="f_envio_soc"
        rules={[{ required: true, message: 'Seleccione la fecha de envío SOC' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
      </Form.Item>

      <Form.Item
        label={getAlias("incoterm")}
        name="incoterm"
        rules={[{ required: true, message: 'Ingrese el incoterm' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getAlias("moneda")}
        name="moneda"
        rules={[{ required: true, message: 'Ingrese la moneda' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getAlias("calidad")}
        name="calidad"
        rules={[{ required: true, message: 'Ingrese la calidad' }]}
      >
        <Input />
      </Form.Item>
    </>
  );
};

export default CamposComerciales;
